import {getAllAnswersForQuestion} from '../../repositories/answers';
import {authValidatedUser} from '../../repositories/authentication';
import {
  getAllQuestionsForUsername, getQuestion,
} from '../../repositories/questions';

/**
 * Used by /question/:qid route to get a question and its answers by
 * question id using getQuestion and getAllAnswersForQuestion from questions
 * and answers repositories respectively.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 */
export const questionGetIDController = async (req, res) => {
  try {
    const questionID = req.params.qID;
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
 * Used by /question route to get all questions for a user by username
 * using getAllQuestionsForUsername from questions repository and their
 * associated answers using getAllAnswersForQuestion from answers repository.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 */
export const questionGetUsernameController = async (req, res) => {
  try {
    const user = req.body || {};
    const authVal = await authValidatedUser(
        user.username, user.password, req.headers,
    );
    if (authVal) {
      const questions = await getAllQuestionsForUsername(user.username);
      const responseData = await buildQuestionAnswerData(questions);
      res.status(200).json(responseData);
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

/**
 * Build the data for the response to the /question route's
 * questionGetUsernameController logic by getting all answers for each question.
 * @param {QuestionData[]} questions
 * @return {Promise<{question: QuestionData, answers: AnswerData[]}[]>} Promise
 * that resolves to an array of objects containing the question and its
 * associated answers.
 */
const buildQuestionAnswerData = async (questions) => {
  const responseData = [];
  for (const question of questions) {
    const answers = await getAllAnswersForQuestion(question.question_id);
    responseData.push({
      question: question.toJSON(),
      answers: answers.map((answer) => answer.toJSON()),
    });
  }
  return responseData;
};

