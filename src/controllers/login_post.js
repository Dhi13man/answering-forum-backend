import {authValidatedUser, generateToken} from '../repositories/authentication';
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
        token: generateToken(username, password),
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
