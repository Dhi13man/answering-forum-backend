import {getAllAnswersForQuestion} from '../../repositories/answers';
import {getQuestion} from '../../repositories/questions';

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

export default questionGetIDController;
