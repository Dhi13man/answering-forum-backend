import {QuestionInputModel} from '../../models/question_data';
import {createQuestion, getNextQuestionID} from '../../repositories/questions';
import {authValidatedUser} from '../login_post';

/**
 * Used by /question route to validate a user's credentials before either
 * allowing them to post a question or rejecting them.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 */
const questionPostController = async (req, res) => {
  const question = req.body.question;
  if (!validateQuestionInput(question)) {
    res.status(400).json({message: 'Question and its title cannot be empty.'});
    return;
  }
  const questionInput = QuestionInputModel.fromJSON(
      req.body,
      await getNextQuestionID(),
  );
  try {
    const user = questionInput.user_details;
    if (await authValidatedUser(user.username, user.password)) {
      await askQuestion(questionInput.question, res);
    } else {
      res.status(401).json({
        message: 'Invalid credentials. Cannot ask question.',
      });
    }
  } catch (err) {
    res.status(500)
        .json({message: err.message || err || 'An unknown error occurred'});
  }
};

export default questionPostController;

/**
 * Asks a Question by using createQuestion from the questions repository.
 * @param {QuestionData} question - The data of the question to be created.
 * @param {Express.Response} res - The response object.
 */
const askQuestion = async (question, res) => {
  const created = await createQuestion(question);
  if (created) {
    res.status(201).json({
      'message': 'Question posted successfully.',
      'question-id': question.question_id,
    });
  } else {
    throw new Error('Question could not be created, despite proper creds.');
  }
};


/**
 * Validate the question input sent in the request.
 * @param {object} question - The data of the question.
 * @return {boolean} - Whether the answer input is valid.
 */
const validateQuestionInput = (question) =>
  question && String(question.title).length > 0;
