import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {getUser} from '../repositories/users';

/**
 * Generates a JWT token from username and password after hashing it.
 * @param {string} username - The username to be used for authentication.
 * @param {string} password - The password to be used for authentication.
 * @return {string} - The generated JWT token.
 */
export const generateToken = (username, password) => {
  return jwt.sign(
      {username: username, hash: hashPassword(password)},
      process.env.JWT_SECRET || 'test',
      {expiresIn: '1h'},
  );
};


/**
 * Method that validates whether given username, password exists in database.
 * @param {string} username - The username to validate.
 * @param {string} password - The password to validate.
 * @param {object} headers - The headers to otherwise validate.
 * @return {Promise<boolean>} - A promise that resolves to a boolean denoting
 * whether the username and corresponding password exists in the database.
 */
export const authValidatedUser = async (username, password, headers={}) => {
  // Validate using credentials
  const user = await getUser(username);
  const val = user && user.password === password;
  // Validate using JWT.
  const token = getBearerToken(headers);
  const jwtVal = await authJWTValidatedUser(token);
  return jwtVal || val;
};

/**
 * Method that validates whether the username, password associated with the jwt
 * token exists in database.
 * @param {string} token - The jwt token to be used for authentication.
 * @return {Promise<boolean>} - A promise that resolves to a boolean denoting
 * whether the user is authenticated via JWT.
 */
const authJWTValidatedUser = async (token) => {
  let out;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test');
    const jwtUser = await getUser(decoded.username);
    out = jwtUser && decoded.hash && verifyHashPassword(
        decoded.hash, jwtUser.password,
    );
  } catch (err) {
    out = false;
  }
  return out;
};

/**
 * Gets the Username from a JWT authorization header
 * @param {object} headers - The request headers object.
 * @return {string} The username of the user.
 */
export const getUsernameFromHeader = (headers) => headers ?
  jwt.verify(
      getBearerToken(headers), process.env.JWT_SECRET || 'test',
  ).username : undefined;

/**
 * Hashes a password using bcrypt.
 * @param {string} password - Plain text password
 * @return {string} - Hashed password
 */
const hashPassword = (password) => {
  const iterations = Number(process.env.ITERATIONS) || 10;
  const salt = bcrypt.genSaltSync(iterations);
  return bcrypt.hashSync(password, salt);
};

/**
 * Verify a password against a hash using bcrypt.
 * @param {string} hash - Hashed password
 * @param {string} password - Plain text password
 * @return {boolean} - Whether the password matches the hash
 */
const verifyHashPassword = (hash, password) =>
  bcrypt.compareSync(password, hash);

/**
 * Gets the bearer token from the headers in the request.
 * @param {object} headers - The request headers.
 * @return {string} The bearer token.
 */
const getBearerToken = (headers) => {
  const auth = String(headers.authorization);
  return auth.startsWith('Bearer') && auth.split(' ')[1];
};

