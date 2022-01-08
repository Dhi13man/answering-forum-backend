import questionPostController
  from '../../src/controllers/questions/question_post';
import {QuestionInputModel} from '../../src/models/question_data';
import {
  getNextQuestionID,
  getQuestion,
  deleteQuestion,
} from '../../src/repositories/questions';

describe('Question Controller Tests', () => {
  // Dummy Question Input Data
  const userName = 'logintest@abc.com';
  const userPassword = 'asdasdasga';
  const dummyTitle = 'dummyTitle';
  const dummyBody = 'dummyBody';
  const dummyQuestionInput = QuestionInputModel.fromJSON({
    'user-details': {
      username: userName,
      password: userPassword,
    },
    'question': {
      title: dummyTitle,
      body: dummyBody,
    },
  });

  // Response messages
  const successQuestionMessage = 'Question posted successfully.';
  const userPassInvalidMessage = 'Invalid credentials. Cannot ask question.';

  // Define tests
  it('Asks Question with valid credentials', async () => {
    const req = {body: dummyQuestionInput.toJSON()};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const qid = await getNextQuestionID();
    await questionPostController(req, res);
    expect(res.json).toHaveBeenCalledWith({
      'message': successQuestionMessage,
      'question-id': qid,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    // Validate and delete the user. Question must have been created.
    const question = await getQuestion(qid);
    expect(question.toJSON()).toStrictEqual({
      ...dummyQuestionInput.question.toJSON(),
      'question-id': qid.toString(),
    });
    // To ensure failed tests don't leave a user behind.
    await deleteQuestion(qid);
  });

  it('Attempts asking question with no username.', async () => {
    const inv = dummyQuestionInput.toJSON();
    delete inv['user-details'].username;
    const req = {body: inv};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await questionPostController(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: userPassInvalidMessage,
    });
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('Attempts asking question with no password.', async () => {
    const inv = dummyQuestionInput.toJSON();
    delete inv['user-details'].password;
    const req = {body: inv};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await questionPostController(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: userPassInvalidMessage,
    });
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('Attempts asking question with invalid credentials', async () => {
    const inv = dummyQuestionInput.toJSON();
    inv['user-details'].password = '';
    const req = {body: inv};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await questionPostController(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: userPassInvalidMessage,
    });
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

