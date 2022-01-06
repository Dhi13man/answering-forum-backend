/**
 * Data Class for the user's data stored in the database.
 * @class
 * @property {string} username - The username of the user.
 * @property {string} password - The password of the user.
 * @property {string} registration_name - The registration name of the user.
 *
 */
export default class UserData {
  /**
     * Constructor for the UserData model.
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @param {string} registrationName - The registration name of the user.
     */
  constructor(username, password, registrationName) {
    this.registration_name = registrationName || (username || '').split('@')[0];
    this.password = password;
    this.username = username;
  }

  /**
     * Utility method to create an UserData model from a json object.
     * @param {object} json - The json object to be converted. Should have keys:
     *  - username - The username of the user.
     *  - password - The password of the user.
     *  - registration-name or registration_name - The name of the user.
     * @return {UserData} model object of the data.
     */
  static fromJSON = (json) => new UserData(
      json.username,
      json.password,
      json['registration-name'] || json.registration_name,
  );

  /**
     * Utility method to convert the user data to a json object.
     * @return {object} Json object of the user data. Has keys:
     * - username - The username of the user.
     * - password - The password of the user.
     * - registration-name - The name of the user.
     */
  toJSON = () => ({
    'registration-name': this.registration_name,
    'password': this.password,
    'username': this.username,
  });
}
