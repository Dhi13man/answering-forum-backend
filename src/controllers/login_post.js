import jwt from 'jsonwebtoken';
import {getUser} from '../repositories/users';
import {validateEmail, validatePassword} from '../utils/validators';

/**
 * Used by /login route to log in a user into the application by validating
 * whether they exist in the internal json database.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 */
const loginPostController = async (req, res) => {
  const {username, password} = req.body;
  try {
    const val = validateUser(username, password);
    const valAuth = val && (await authValidatedUser(username, password));
    if (valAuth) {
      res.status(201).json({
        message: 'user logged in successfully',
        token: jwt.sign(
            {username, password},
            process.env.JWT_SECRET || 'test',
            {expiresIn: '1h'},
        ),
      });
    } else {
      res.status(401).json({message: 'Sorry invalid credentials'});
    }
  } catch (err) {
    res.status(500)
        .json({message: err.message || err || 'An unknown error occurred'});
  }
};

export default loginPostController;

/**
 * Method that validates whether given username, password exists in database.
 * Used to authenticate users by checking whether they are valid.
 * @param {string | undefined} username - The username to validate.
 * @param {string | undefined} password - The password to validate.
 * @return {boolean} - A boolean denoting whether credentials are valid,
 * implying both username and password exist and username is a valid email.
 */
const validateUser = (username, password) =>
  username && validatePassword(password) && validateEmail(username);

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
  const auth = String(headers.authorization);
  const token = auth.startsWith('Bearer') && auth.split(' ')[1];
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
    out = jwtUser && decoded.password && jwtUser.password === decoded.password;
  } catch (err) {
    out = false;
  }
  return out;
};
