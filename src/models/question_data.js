/**
 * Data Class for the Question's full data stored in the database.
 * @class
 * @property {QuestionData} question - The data of the question.
 * @property {QuestionUser} user_details - Data of the user asking the question.
 */
export class QuestionInputModel {
  /**
   * Constructor for the QuestionModel.
   * @param {string} username - The username of the user asking the question.
   * @param {string} password - The password of the user asking the question.
   * @param {string} title - The title of the question.
   * @param {string} body - The body of the question.
   * @param {number} questionID - The id of the question (optional)
   */
  constructor(username, password, title, body, questionID) {
    this.user_details = new QuestionUser(username, password);
    this.question = new QuestionData(title, body, questionID, username);
  }

  /**
   * Utility method to create an UserData model from a json object.
   * @param {object} json - The json object to be converted. Should have keys:
   * * user-details (or user_details) - The details of the user asking the
   *   question. Should further have keys:
   *    - username - The username of the user asking the question.
   *    - password - The password of the user asking the question.
   * * question - The data of the question. Should further have keys:
   *    - title - The title of the question.
   *    - body - The body of the question.
   *    - question-id (or question_id) - The ID of the question.
   *    - username - The username of the user asking the question.
   * @param {number} questionID - The ID of the question. Priority is given
   * to the id in the json object if both are given.
   * @return {QuestionInputModel} object of the QuestionModel.
   */
  static fromJSON = (json, questionID) => {
    const userDetails = json['user-details'] || json.user_details || {};
    const question = json.question || {};
    return new QuestionInputModel(
        userDetails.username,
        userDetails.password,
        question.title,
        question.body,
        question['question-id'] || question.question_id || questionID,
    );
  };

  /**
   * Utility method to convert the user data to a json object.
   * @return {object} Json object of the user data. Has keys:
   * * user-details - The details of user asking the question. Further has keys:
   *    - username - The username of the user asking the question.
   *    - password - The password of the user asking the question.
   * * question - The data of the question. Further has keys:
   *    - title - The title of the question.
   *    - body - The body of the question.
   *    - question-id (optional) - The ID of the question.
   *    - username - The username of the user asking the question.
   */
  toJSON = () => ({
    'user-details': this.user_details.toJSON(),
    'question': this.question.toJSON(),
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
   * Constructor for the QuestionUser model.
   * @param {string} username - The username of the user asking the question.
   * @param {string} password - The password of the user asking the question.
   */
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  /**
   * Utility method to create an UserData model from a json object.
   * @param {object} json - The json object to be converted. Should have keys:
   * - username - The username of the user asking the question.
   * - password - The password of the user asking the question.
   * @return {QuestionUser} object of the QuestionUser.
   */
  static fromJSON = (json) => new QuestionUser(json.username, json.password);

  /**
   * Utility method to convert the user data to a json object.
   * @return {object} Json object of the user data. Has keys:
   * - username - The username of the user asking the question.
   * - password - The password of the user asking the question.
   */
  toJSON = () => ({'password': this.password, 'username': this.username});
}

/**
 * Data Class for the question.
 * @class
 * @property {string} title - The title of the question.
 * @property {string} body - The body of the question.
 * @property {number} question_id - The id of the question.
 * @property {string} username - The username of the user asking the question.
 */
export class QuestionData {
  /**
   * Constructor for the QuestionData model.
   * @param {string} title - The title of the question.
   * @param {string} body - The body of the question.
   * @param {number} questionID - The id of the question.
   * @param {string} username - The username of the user asking the question.
   */
  constructor(title, body, questionID, username) {
    this.title = title;
    this.body = body;
    this.question_id = questionID;
    this.username = username;
  }

  /**
   * Utility method to create an UserData model from a json object.
   * @param {object} json - The json object to be converted. Should have keys:
   * - title - The title of the question.
   * - body - The body of the question.
   * - question-id (or question_id) - The id of the question (optional). Always
   *   parsed to number for consistency. Throws error if not a number.
   * @param {number} questionID - The id of the question. Priority is given
   * to the id in the json object if both are given.
   * @return {QuestionData} object of the QuestionData.
   */
  static fromJSON = (json, questionID) => new QuestionData(
      json.title,
      json.body,
      Number(json['question-id'] || json.questionID || questionID),
      json.username,
  );

  /**
   * Utility method to convert the user data to a json object.
   * @return {object} Json object of the user data. Has keys:
   * - title - The title of the question.
   * - body - The body of the question.
   * - question-id - The id of the question (optional). Always returned
   * as string for convenience but is numeric.
   */
  toJSON = () => ({
    'title': this.title,
    'body': this.body,
    'question-id': this.question_id ? this.question_id.toString() : undefined,
    'username': this.username,
  });
}
