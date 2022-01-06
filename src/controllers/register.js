import UserData from '../models/user_data.js';
import {createUser} from '../repositories/users.js';
import {validateEmail, validatePassword} from '../utils/validators.js';

/**
 * Used by /register route to register an user by creating their record
 * in the internal database.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 */
const registerController = async (req, res) => {
  const userData = UserData.fromJSON(req.body);
  try {
    if (validateCreds(userData, res)) {
      await registerUser(userData, res);
    }
  } catch (err) {
    res.status(500)
        .json({message: err.message || err || 'An unknown error occurred'});
  }
};

export default registerController;

/**
 * Utility function to validate the credentialas associated with the request.
 * @param {UserData} userData - The data of the user to be created.
 * @param {Express.Response} res - The response object.
 * @return {boolean} Whether the request body is valid.
 */
const validateCreds = (userData, res) => {
  const appropriateCreds =
    !userData.username || !validatePassword(userData.password);
  if (appropriateCreds) {
    res.status(401).json({
      message: 'username and password longer than 4 characters are required.',
    });
    return false;
  } else if (!validateEmail(userData.username)) {
    res.status(401).json({message: 'username is Invalid email.'});
    return false;
  }
  return true;
};

/**
 * Utility function uses createUser to create a user for registering them.
 * @param {UserData} userData - The data of the user to be created.
 * @param {Express.Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the user is created or
 * fails with 401.
 */
const registerUser = async (userData, res) => {
  const userCreated = await createUser(userData);
  if (userCreated) {
    res.status(201).json({
      'message': 'User Registered Successfully',
      'registration-name': userData.registration_name,
    });
  } else {
    res.status(401).json({
      message: 'Failed to create user even though credentials were valid.',
    });
  }
};
