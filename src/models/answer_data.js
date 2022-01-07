/**
 * Data Class for the Answer's full data stored in the database.
 * @class
 * @property {QuestionData} answer - The data of the answer.
 * @property {QuestionUser} user_details - Data of the user sending the answer.
 */
export class AnswerInputModel {
  /**
   * Constructor for the QuestionModel.
   * @param {string} username - The username of the user sending the answer.
   * @param {string} password - The password of the user sending the answer.
   * @param {string} title - The title of the answer.
   * @param {string} body - The body of the answer.
   * @param {number} questionID - The id of the answer (optional)
   */
  constructor(username, password, title, body, questionID) {
    this.user_details = new AnswerUser(username, password);
    this.answer = new AnswerData(title, body, questionID, username);
  }

  /**
   * Utility method to create an UserData model from a json object.
   * @param {object} json - The json object to be converted. Should have keys:
   * - user-details (or user_details) - The details of the user sending the
   *   answer. Further has keys: username, password.
   * - answer - The data of the answer. Further has keys: title, body,
   *   question-id (optional)
   * @param {number} questionID - The id of the question this answer is for.
   *  Priority is given to the id in the json object if both are given.
   * @return {AnswerInputModel} object of the QuestionModel.
   */
  static fromJSON = (json, questionID) => {
    const userDetails = json['user-details'] || json.user_details || {};
    const answer = json.answer || {};
    return new AnswerInputModel(
        userDetails.username,
        userDetails.password,
        answer.title,
        answer.body,
        answer['question-id'] || answer.question_id || questionID,
    );
  };

  /**
   * Utility method to convert the user data to a json object.
   * @return {object} Json object of the user data. Has keys:
   * - user-details - The details of the user sending the answer.
   * Further has keys: username, password.
   * - answer - The data of the answer. Further has keys: title, body,
   *   question-id (optional)
   */
  toJSON = () => ({
    'user-details': this.user_details.toJSON(),
    'answer': this.answer.toJSON(),
  });
}

/**
 * Data Class for the the user sending the answer.
 * @class
 * @property {string} username - The username of the user sending the answer.
 * @property {string} password - The password of the user sending the answer.
 */
export class AnswerUser {
  /**
   * Constructor for the QuestionUser model.
   * @param {string} username - The username of the user sending the answer.
   * @param {string} password - The password of the user sending the answer.
   */
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  /**
   * Utility method to create an UserData model from a json object.
   * @param {object} json - The json object to be converted. Should have keys:
   * - username - The username of the user sending the answer.
   * - password - The password of the user sending the answer.
   * @return {AnswerUser} object of the QuestionUser.
   */
  static fromJSON = (json) => new AnswerUser(json.username, json.password);

  /**
   * Utility method to convert the user data to a json object.
   * @return {object} Json object of the user data. Has keys:
   * - username - The username of the user sending the answer.
   * - password - The password of the user sending the answer.
   */
  toJSON = () => ({
    password: this.password,
    username: this.username,
  });
}

/**
 * Data Class for the answer.
 * @class
 * @property {string} answer - The text of the answer.
 * @property {number} question_id - The id of the question it belongs to.
 * @property {string} username - The username of the user sending the answer.
 */
export class AnswerData {
  /**
   * Constructor for the QuestionData model.
   * @param {string} answer - The text of the answer.
   * @param {number} questionID - The id of the question it belongs to.
   * @param {string} username - The username of the user sending the answer.
   */
  constructor(answer, questionID, username) {
    this.answer = answer;
    this.question_id = questionID;
    this.username = username;
  }

  /**
   * Utility method to create an UserData model from a json object.
   * @param {object} json - The json object to be converted. Should have keys:
   * - answer - The text of the answer.
   * - question-id (or question_id) - The id of the question that the answer
   * belongs to (optional).
   * - username - The username of the user sending the answer.
   * @param {number} questionID - The id of the question that the answer belongs
   * to. Priority is given to the id in the json object if both are given.
   * @return {AnswerData} object of the QuestionData.
   */
  static fromJSON = (json, questionID) =>
    new AnswerData(
        json.answer,
        json['question-id'] || json.questionID || questionID,
        json.username,
    );

  /**
   * Utility method to convert the user data to a json object.
   * @return {object} Json object of the user data. Has keys:
   * - title - The text of the answer.
   * - question-id - The id of the question it belongs to (optional).
   * - username - The username of the user sending the answer.
   */
  toJSON = () => ({
    'answer': this.answer,
    'question-id': this.question_id,
    'username': this.username,
  });
}
