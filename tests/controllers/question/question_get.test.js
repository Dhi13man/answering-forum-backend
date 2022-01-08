import {questionGetIDController, questionGetUsernameController}
  from '../../../src/controllers/question/question_get';
import {QuestionData} from '../../../src/models/question_data';
import {createQuestion, deleteQuestion}
  from '../../../src/repositories/questions';

describe('Question GET Controller Tests', () => {
  // Dummy User for auth.
  const userName = 'logintest@abc.com';
  const userPassword = 'asdasdasga';
  const userData = {username: userName, password: userPassword};

  // Dummy Question Data
  const dummyQID = '-1';
  const dummyQuestionTitle = 'dummyQuestionTitle';
  const dummyQuestionBody = 'dummyQuestionBody';
  const dummyQuestion = new QuestionData(
      dummyQuestionTitle, dummyQuestionBody, dummyQID, userName,
  );

  // Define tests
  it(
      'Gets all Answers by dummy question ID without creating any.',
      async () => {
        const req = {params: {qID: dummyQID}};
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        };
        await questionGetIDController(req, res);
        expect(res.json).toHaveBeenCalledWith({
          'message': `Question having ID ${dummyQID} was not found.`,
        });
        expect(res.status).toHaveBeenCalledWith(404);
      },
  );

  it(
      'Creates a dummy question and gets all Answers by question ID.',
      async () => {
        await createQuestion(dummyQuestion);
        const req = {params: {qID: dummyQuestion.question_id}};
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        };
        await questionGetIDController(req, res);
        expect(res.json).toHaveBeenCalledWith(
            {answers: [], question: dummyQuestion.toJSON()},
        );
        expect(res.status).toHaveBeenCalledWith(200);
        await deleteQuestion(dummyQuestion.question_id);
      },
  );

  it('Gets all Questions by userName without creating any.', async () => {
    const req = {body: userData};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await questionGetUsernameController(req, res);
    expect(res.json).toHaveBeenCalledWith([]);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it(
      // eslint-disable-next-line max-len
      'Creates a question for userName and then attemps to fetch all their questions.',
      async () => {
        await createQuestion(dummyQuestion);
        const req = {body: userData};
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        };
        await questionGetUsernameController(req, res);
        expect(res.json)
            .toHaveBeenCalledWith([
              {answers: [], question: dummyQuestion.toJSON()},
            ]);
        expect(res.status).toHaveBeenCalledWith(200);
        await deleteQuestion(dummyQuestion.question_id);
      },
  );
});
