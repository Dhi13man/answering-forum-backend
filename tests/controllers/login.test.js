import loginController from '../../src/controllers/login';

describe('Login Controller Tests', () => {
  // Dummy User data
  const dummyUserName = 'logintest@abc.com';
  const dummyUserPassword = 'asdasdasga';

  // Response messages
  const successLoginMessage = 'user logged in successfully';
  const userPassInvalidMessage = 'Sorry invalid credentials';

  // Define tests
  it('Logs in with valid credentials', async () => {
    const req = {
      body: {
        username: dummyUserName,
        password: dummyUserPassword,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await loginController(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: successLoginMessage,
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('Attempts login with no username.', async () => {
    const req = {
      body: {
        password: dummyUserPassword,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await loginController(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: userPassInvalidMessage,
    });
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('Attempts login with no password.', async () => {
    const req = {
      body: {
        username: dummyUserName,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await loginController(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: userPassInvalidMessage,
    });
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('Attempts login with invalid credentials', async () => {
    const req = {
      body: {
        username: dummyUserName,
        password: '',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await loginController(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: userPassInvalidMessage,
    });
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
