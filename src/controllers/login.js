import {getUser} from '../repositories/users.js';
import {validateEmail, validatePassword} from '../utils/validators.js';

/**
 * Used by /login route to log in a user into the application by validating
 * whether they exist in the internal json database.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 */
const loginController = async (req, res) => {
  const {username, password} = req.body;
  try {
    const val = validateUser(username, password);
    const valAuth = val && (await authValidatedUser(username, password));
    if (valAuth) {
      res.status(201).json({message: 'user logged in successfully'});
    } else {
      res.status(401).json({message: 'Sorry invalid credentials'});
    }
  } catch (err) {
    res.status(500)
        .json({message: err.message || err || 'An unknown error occurred'});
  }
};

export default loginController;

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
 *
 * @param {string} username
 * @param {string} password
 * @return {Promise<boolean>} - A promise that resolves to a boolean denoting
 * whether the username and corresponding password exists in the database.
 */
export const authValidatedUser = async (username, password) => {
  const user = await getUser(username);
  return user && user.password === password;
};
