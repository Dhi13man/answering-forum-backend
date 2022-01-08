/**
 * Data Class for the Answer's full data stored in the database.
 * @class
 * @property {AnswerData} answer - The data of the answer.
 * @property {AnswerUser} user_details - Data of the user sending the answer.
 */
export class AnswerInputModel {
  /**
   * Constructor for the AnswerModel.
   * @param {string} username - The username of the user sending the answer.
   * @param {string} password - The password of the user sending the answer.
   * @param {string} answerText - The text of the answer.
   * @param {string} questionID - The id of the question the answer belongs
   * to. (optional)
   */
  constructor(username, password, answerText, questionID) {
    this.user_details = new AnswerUser(username, password);
    this.answer = new AnswerData(answerText, questionID, username);
  }

  /**
   * Utility method to create an UserData model from a json object.
   * @param {object} json - The json object to be converted. Should have keys:
   *  * user-details (or user_details) - The details of the user sending the
   answer. Should further have keys:
   *    - username - The username of the user asking the question.
   *    - password - The password of the user asking the question.
   *  * answer - The data of the answer. Should further have keys:
   *    - answer - The actual text of the answer.
   *    - question-id (or question_id) - The id of question that answer belongs.
   *    - username - The username of the user sending the answer.
   * @return {AnswerInputModel} object of the AnswerModel.
   */
  static fromJSON = (json) => {
    const userDetails = json['user-details'] || json.user_details;
    const answer = json.answer;
    return new AnswerInputModel(
        userDetails.username,
        userDetails.password,
        answer.answer,
        answer['question-id'] || answer.question_id,
    );
  };

  /**
   * Utility method to convert the user data to a json object.
   * @return {object} Json object of the user data. Has keys:
   * * user-details (or user_details) - The details of the user sending the
   *   answer. Should further have keys:
   *    - username - The username of the user asking the question.
   *    - password - The password of the user asking the question.
   * * answer - The data of the answer. Should further have keys:
   *    - answer - The actual text of the answer.
   *    - question-id (optional) - The id of the question the answer belongs to.
   *    - username - The username of the user sending the answer.
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
   * Constructor for the AnswerUser model.
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
   * @return {AnswerUser} object of the AnswerUser.
   */
  static fromJSON = (json) => new AnswerUser(json.username, json.password);

  /**
   * Utility method to convert the user data to a json object.
   * @return {object} Json object of the user data. Has keys:
   * - username - The username of the user sending the answer.
   * - password - The password of the user sending the answer.
   */
  toJSON = () => ({password: this.password, username: this.username});
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
   * Constructor for the AnswerData model.
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
   * @return {AnswerData} object of the AnswerData.
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
