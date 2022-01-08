import answerPostController
  from '../../../src/controllers/answer/answer_post';
import {AnswerInputModel} from '../../../src/models/answer_data';
import {
  getAnswer,
  deleteAnswer,
} from '../../../src/repositories/answers';

describe('Answer POST/PUT Controller Tests', () => {
  // Dummy Answer Input Data
  const userName = 'logintest@abc.com';
  const userPassword = 'asdasdasga';
  const dummyAnswerText = 'dummyAnswerText';
  const dummyQID = '-1';
  const dummyAnswerInput = AnswerInputModel.fromJSON({
    'user-details': {
      username: userName,
      password: userPassword,
    },
    'answer': {
      'answer': dummyAnswerText,
      'question-id': dummyQID,
    },
  });

  // Response messages
  const successPOSTAnswerMessage = 'Answer posted successfully.';
  const successPUTAnswerMessage = 'Answer updated successfully.';
  const userPassInvalidMessage = 'Invalid credentials. Cannot post answer.';
  const answerEmptyMessage = 'Answer text and question ID cannot be empty.';

  // Define tests
  it('Posts Answer with valid credentials.', async () => {
    const req = {body: dummyAnswerInput.toJSON(), params: {qID: dummyQID}};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await answerPostController(req, res, 'POST');
    expect(res.json).toHaveBeenCalledWith({
      'message': successPOSTAnswerMessage,
      'question-id': dummyQID,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    // Validate and delete the user. Answer must have been created.
    const answer = await getAnswer(dummyQID, userName);
    expect(answer.toJSON()).toStrictEqual({
      ...dummyAnswerInput.answer.toJSON(),
      'question-id': dummyQID.toString(),
    });
    // To ensure failed tests don't leave a user behind.
    await deleteAnswer(dummyQID, userName);
  });

  it('Posts Answer and Updates it with valid credentials.', async () => {
    const req = {body: dummyAnswerInput.toJSON(), params: {qID: dummyQID}};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await answerPostController(req, res, 'POST');
    req.body.answer.answer = 'updatedAnswerText';
    await answerPostController(req, res, 'PUT');
    expect(res.json).toHaveBeenCalledWith({
      'message': successPUTAnswerMessage,
      'question-id': dummyQID,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    // Validate and delete the user. Answer must have been created.
    const answer = await getAnswer(dummyQID, userName);
    expect(answer.answer).toStrictEqual('updatedAnswerText');
    // To ensure failed tests don't leave a user behind.
    await deleteAnswer(dummyQID, userName);
  });

  it('Attempts posting answer with no username.', async () => {
    const inv = dummyAnswerInput.toJSON();
    delete inv['user-details'].username;
    const req = {body: inv, params: {qID: dummyQID}};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await answerPostController(req, res, 'POST');
    expect(res.json).toHaveBeenCalledWith({
      message: userPassInvalidMessage,
    });
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('Attempts posting answer with no password.', async () => {
    const inv = dummyAnswerInput.toJSON();
    delete inv['user-details'].password;
    const req = {body: inv, params: {qID: dummyQID}};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await answerPostController(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: userPassInvalidMessage,
    });
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('Attempts posting answer with invalid credentials.', async () => {
    const inv = dummyAnswerInput.toJSON();
    inv['user-details'].password = '';
    const req = {body: inv, params: {qID: dummyQID}};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await answerPostController(req, res, 'POST');
    expect(res.json).toHaveBeenCalledWith({
      message: userPassInvalidMessage,
    });
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('Attempts posting answer with no answer text.', async () => {
    const inv = dummyAnswerInput.toJSON();
    inv.answer.answer = '';
    const req = {body: inv, params: {qID: dummyQID}};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await answerPostController(req, res, 'POST');
    expect(res.json).toHaveBeenCalledWith({
      message: answerEmptyMessage,
    });
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

