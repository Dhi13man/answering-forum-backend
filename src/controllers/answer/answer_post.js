import {AnswerInputModel} from '../../models/answer_data';
import {
  createAnswer,
  updateAnswer,
  getAnswer,
} from '../../repositories/answers';
import {authValidatedUser} from '../../repositories/authentication';
import {getQuestion} from '../../repositories/questions';

/**
 * Used by /answer route to validate a user's credentials before either
 * allowing them to post an answer or rejecting them.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @param {string} method - The HTTP method of the request.
 */
const answerPostController = async (req, res, method='POST') => {
  try {
    const answer = req.body.answer;
    const questionID = req.params.qID;
    if (!validateAnswerInput(answer, questionID)) {
      res.status(400)
          .json({message: 'Answer text and question ID cannot be empty.'});
      return;
    } else if (!await validateQuestionID(questionID)) {
      res.status(404).json({message: 'Question does not exist.'});
      return;
    }
    const answerInput = AnswerInputModel.fromJSON(req.body);
    answerInput.answer.question_id = questionID;
    const user = answerInput.user_details;
    const authVal = await authValidatedUser(
        user.username, user.password, req.headers,
    );
    await validateAndPOST(method, authVal, answerInput.answer, res);
    await validateAndPUT(
        method, questionID, user, authVal, answerInput.answer, res,
    );
  } catch (err) {
    res.status(500)
        .json({message: err.message || err || 'An unknown error occurred'});
  }
};

export default answerPostController;

/**
 * Validates the REQUEST if method is POST (for answer creation).
 * @param {string} method - The HTTP method of the request.
 * @param {boolean} authVal - The result of validation and authentication
 * of the user.
 * @param {AnswerData} answer - The data of the Answer to be created.
 * @param {Express.Response} res - The response object.
 * @return {Promise<boolean>} - Whether the request is valid or not.
 */
const validateAndPOST = async (method, authVal, answer, res) => {
  if (authVal && method === 'POST') {
    await postAnswer(answer, res);
  } else if (method === 'POST') {
    res.status(401).json({
      message: 'Invalid credentials. Cannot post answer.',
    });
  }
};

/**
 * Validates the REQUEST if method is PUT (for answer updation).
 * Gets the answer from the database and checks if the user is the owner of
 * the answer.
 * @param {string} method - The HTTP method of the request.
 * @param {string} questionID - The ID of the question.
 * @param {UserData} user - The user data of the user.
 * @param {boolean} authVal - The result of validation and authentication
 * of the user.
 * @param {AnswerData} answer - The data of the Answer to be created.
 * @param {Express.Response} res - The response object.
 * @return {Promise<boolean>} - The Promise that resolves to whether the request
 * is valid or not.
 */
const validateAndPUT = async (
    method,
    questionID,
    user,
    authVal,
    answer,
    res,
) => {
  const existing = await getAnswer(questionID, user.username);
  if (authVal && method === 'PUT' && existing) {
    await putAnswer(answer, res);
  } else if (method === 'PUT') {
    res.status(403).json({
      message: 'Invalid credentials. Cannot update answer.',
    });
  }
};

/**
 * Post an answer by using createAnswer from the answers repository.
 * @param {AnswerData} answer - The data of the Answer to be created.
 * @param {Express.Response} res - The response object.
 */
const postAnswer = async (answer, res) => {
  const created = await createAnswer(answer);
  if (created) {
    res.status(201).json({
      'message': 'Answer posted successfully.',
      'question-id': answer.question_id,
    });
  } else {
    throw new Error('Answer could not be created, despite proper creds.');
  }
};

/**
 * Update an answer by using updateAnswer from the answers repository.
 * @param {AnswerData} answer - The data of the Answer to be created.
 * @param {Express.Response} res - The response object.
 */
const putAnswer = async (answer, res) => {
  const created = await updateAnswer(answer);
  if (created) {
    res.status(200).json({
      'message': 'Answer updated successfully.',
      'question-id': answer.question_id,
    });
  } else {
    throw new Error('Answer could not be updated, despite proper creds.');
  }
};

/**
 * Validate the answer input sent in the request
 * @param {object} answer - The answer body.
 * @param {string} questionID - The ID of the question associated.
 * @return {boolean} - Whether the answer input is valid.
 */
const validateAnswerInput = (answer, questionID) =>
  answer && answer.answer && String(answer.answer).length > 0 && questionID;

/**
 * Validate the question ID sent in the request
 * @param {string} questionID - The ID of the question associated.
 * @return {Promise<boolean>} - Whether question having the ID exists or not.
 */
const validateQuestionID = async (questionID) =>
  questionID && getQuestion(questionID);
