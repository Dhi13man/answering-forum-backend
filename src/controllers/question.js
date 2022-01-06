/**
 * Used by /question route to log in a user into the application by validating
 * whether they exist in the internal json database.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 */
const questionController = async (req, res) => {
  const {user-details: us, password} = req.body;
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

export default questionController;
