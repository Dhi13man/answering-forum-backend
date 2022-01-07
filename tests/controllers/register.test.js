import registerController from '../../src/controllers/register';
import UserData from '../../src/models/user_data';
import {getUser, deleteUser} from '../../src/repositories/users';

describe('Register Controller Tests', () => {
  // Dummy User data
  const dummyUserName = 'registertest@abc.com';
  const dummyUserPassword = 'asdasdasga';
  const dummyUserRegistrationName = 'registertest';
  const dummyUser = UserData.fromJSON({
    username: dummyUserName,
    password: dummyUserPassword,
    registration_name: dummyUserRegistrationName,
  });

  // Response messages
  const successRegisterMessage = 'User Registered Successfully';
  const userPassInvalidMessage =
        'username and password longer than 4 characters are required.';

  // Define tests
  it('Registers with valid credentials', async () => {
    const req = {
      body: {
        'username': dummyUserName,
        'password': dummyUserPassword,
        'registration-name': dummyUserRegistrationName,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await registerController(req, res);
    expect(res.json).toHaveBeenCalledWith({
      'message': successRegisterMessage,
      'registration-name': dummyUserRegistrationName,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    // Validate and delete the user
    const user = await getUser(dummyUserName);
    expect(user.toJSON()).toStrictEqual(dummyUser.toJSON());
    // To ensure failed tests don't leave a user behind.
    await deleteUser(dummyUserName);
  });

  it('Attempts to register with invalid credentials', async () => {
    const req = {
      body: {
        'username': '',
        'password': '',
        'registration-name': '',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await registerController(req, res);
    expect(res.json).toHaveBeenCalledWith({message: userPassInvalidMessage});
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('Attempts to register with no email', async () => {
    const req = {
      body: {
        'password': dummyUserPassword,
        'registration-name': dummyUserRegistrationName,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await registerController(req, res);
    expect(res.json).toHaveBeenCalledWith({message: userPassInvalidMessage});
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('Attempts to register with no password', async () => {
    const req = {
      body: {
        'username': dummyUserName,
        'registration-name': dummyUserRegistrationName,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await registerController(req, res);
    expect(res.json).toHaveBeenCalledWith({message: userPassInvalidMessage});
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it(
      'Registers with no registration name (auto assign registration name)',
      async () => {
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
        await registerController(req, res);
        expect(res.json).toHaveBeenCalledWith({
          'message': successRegisterMessage,
          'registration-name': dummyUserRegistrationName,
        });
        expect(res.status).toHaveBeenCalledWith(201);
        // Validate and delete the user
        const user = await getUser(dummyUserName);
        expect(user.toJSON()).toStrictEqual(dummyUser.toJSON());
        // Ensure tests don't leave a user behind.
        await deleteUser(dummyUserName);
      },
  );

  it('Attempts to register an already registered user', async () => {
    const req = {
      body: {
        'username': dummyUserName,
        'password': dummyUserPassword,
        'registration-name': dummyUserRegistrationName,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await registerController(req, res);
    const res2 = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    await registerController(req, res2);
    expect(res2.json).toHaveBeenCalledWith({
      message: `User with username ${dummyUserName} already exists.`,
    });
    expect(res2.status).toHaveBeenCalledWith(500);
    // Ensure tests don't leave a user behind.
    await deleteUser(dummyUserName);
  });
});
