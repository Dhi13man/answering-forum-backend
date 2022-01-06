/**
 * Data Class for the Question's full data stored in the database.
 * @class
 * @property {QuestionData} question - The data of the question.
 * @property {QuestionUser} user_details - Data of the user asking the question.
 * @property {number} question_id - The id of the question.
 */
export class QuestionModel {
  /**
   * Constructor for the UserData model.
   * @param {string} username - The username of the user asking the question.
   * @param {string} password - The password of the user asking the question.
   * @param {string} title - The title of the question.
   * @param {string} body - The body of the question.
   * @param {number} questionID - The id of the question.
   */
  constructor(username, password, title, body, questionID) {
    this.user_details = new QuestionUser(username, password);
    this.question = new QuestionData(title, body);
    this.question_id = questionID;
  }

  /**
   * Utility method to create an UserData model from a json object.
   * @param {object} json - The json object to be converted. Should have keys:
   * - user-details (or user_details) - The details of the user asking the
   *   question. Further has keys: username, password.
   * - question - The data of the question. Further has keys: title, body.
   * - question-id (or question_id) - The id of the question (optional).
   * @param {number} questionID - The id of the question. Priority is given
   * to the id in the json object if both are given.
   * @return {QuestionModel} object of the QuestionModel.
   */
  static fromJSON = (json, questionID) => new QuestionModel(
      (json['user-details'] || json.user_details).username,
      (json['user-details'] || json.user_details).password,
      json.question.title,
      json.question.body,
      json['question-id'] || json.questionID || questionID,
  );

  /**
   * Utility method to convert the user data to a json object.
   * @return {object} Json object of the user data. Has keys:
   * - user-details - The details of the user asking the question. Further has
   *  keys: username, password.
   * - question - The data of the question. Further has keys: title, body.
   * - question-id (or question_id) - The id of the question (optional).
   */
  toJSON = () => ({
    'user-details': this.registration_name,
    'question': this.question,
    'question-id': this.question_id,
  });
}

/**
 * Data Class for the the user asking the question.
 * @class
 * @property {string} username - The username of the user asking the question.
 * @property {string} password - The password of the user asking the question.
 */
export class QuestionUser {
  /**
   * Constructor for the UserData model.
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   */
  constructor(username, password) {
    this.password = password;
    this.username = username;
  }

  /**
   * Utility method to create an UserData model from a json object.
   * @param {object} json - The json object to be converted. Should have keys:
   * - username - The username of the user.
   * - password - The password of the user.
   * @return {QuestionUser} object of the QuestionUser.
   */
  static fromJSON = (json) => new QuestionUser(
      json.username,
      json.password,
  );

  /**
   * Utility method to convert the user data to a json object.
   * @return {object} Json object of the user data.
   */
  toJSON = () => ({
    'password': this.password,
    'username': this.username,
  });
}

/**
 * Data Class for the question.
 * @class
 * @property {string} title - The title of the question.
 * @property {string} body - The body of the question.
 */
export class QuestionData {
  /**
   * Constructor for the QuestionData model.
   * @param {string} title - The username of the user.
   * @param {string} body - The password of the user.
   */
  constructor(username, password) {
    this.password = password;
    this.username = username;
  }

  /**
   * Utility method to create an UserData model from a json object.
   * @param {object} json - The json object to be converted.
   * @return {v} object of the QuestionUser.
   */
  static fromJSON = (json) => new QuestionData(
      json.username,
      json.password,
  );

  /**
   * Utility method to convert the user data to a json object.
   * @return {object} Json object of the user data.
   */
  toJSON = () => ({
    'password': this.password,
    'username': this.username,
  });
}
