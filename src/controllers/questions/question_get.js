import {QuestionUser} from '../../models/question_data';
import {getAllAnswersForQuestion} from '../../repositories/answers';
import {
  getAllQuestionsForUsername,
  getQuestion,
} from '../../repositories/questions';
import {authValidatedUser} from '../login_post';

/**
 * Used by /question route to log in a user into the application by validating
 * whether they exist in the internal json database.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 */
export const questionGetIDController = async (req, res) => {
  const questionID = req.params.qID;
  try {
    const question = await getQuestion(questionID);
    const answers = await getAllAnswersForQuestion(questionID);
    if (question) {
      res.status(200).json({
        question: question.toJSON(),
        answers: answers.map((answer) => answer.toJSON()),
      });
    } else {
      res.status(404).json({
        message: `Question having ID ${questionID} was not found.`,
      });
    }
  } catch (err) {
    res.status(500)
        .json({message: err.message || err || 'An unknown error occurred'});
  }
};

/**
 * Used by /question route to log in a user into the application by validating
 * whether they exist in the internal json database.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 */
export const questionGetUsernameController = async (req, res) => {
  const user = QuestionUser.fromJSON(req.body);
  try {
    const authVal = await authValidatedUser(user.username, user.password);
    const questions = await getAllQuestionsForUsername(user.username);
    if (authVal) {
      res.status(200).json({
        questions: questions.map((answer) => answer.toJSON()),
      });
    } else {
      res.status(401).json({
        message: 'Could not authenticate user. ' +
                'Enter username and password in request body.',
      });
    }
  } catch (err) {
    res.status(500)
        .json({message: err.message || err || 'An unknown error occurred'});
  }
};

