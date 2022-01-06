import {QuestionInputModel} from '../models/question_data.js';
import {createQuestion, getNextQuestionID} from '../repositories/questions.js';
import {authValidatedUser} from './login.js';

/**
 * Used by /question route to log in a user into the application by validating
 * whether they exist in the internal json database.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 */
const questionController = async (req, res) => {
  const questionInput = QuestionInputModel.fromJSON(
      req.body,
      await getNextQuestionID(),
  );
  try {
    const user = questionInput.user_details;
    if (await authValidatedUser(user.username, user.password)) {
      await askQuestion(questionInput, res);
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

export default questionController;

/**
 * Asks a Question by using createQuestion from the questions repository.
 * @param {QuestionInputModel} questionInput - The input data of the
 * question to be created.
 * @param {Express.Response} res - The response object.
 */
const askQuestion = async (questionInput, res) => {
  const created = await createQuestion(questionInput.question);
  if (created) {
    res.status(201).json({
      'message': 'Question posted successfully',
      'question-id': questionInput.question_id,
    });
  } else {
    throw new Error('Question could not be created, despite proper creds.');
  }
};

