import UserData from '../../src/models/user_data.js';
import {
  getUser,
  createUser,
  deleteUser,
  updateUser,
} from '../../src/repositories/users.js';

describe('Users repository Tests', () => {
  const dummyUserName = 'dummy@UserName.com';
  const dummyUserPassword = 'dummyUserPassword';
  const dummyRegistrationName = 'dummyRegistrationName';
  const dummyUser = UserData.fromJSON({
    username: dummyUserName,
    password: dummyUserPassword,
    registration_name: dummyRegistrationName,
  });
  const updatedDummyUserPassword = 'updatedDummyUserPassword';
  const updatedDummyRegistrationName = 'updatedDummyRegistrationName';
  const updatedDummyUser = UserData.fromJSON({
    username: dummyUserName,
    password: updatedDummyUserPassword,
    registration_name: updatedDummyRegistrationName,
  });


  test('Create a dummy user.', async () => {
    const created = await createUser(dummyUser);
    expect(created).toBe(true);
  });

  test('Get the dummy user.', async () => {
    const user = await getUser(dummyUserName);
    expect(user.toJSON()).toStrictEqual(dummyUser.toJSON());
  });

  test(
      'Update the dummy user and validate the dummy user\'s updated data.',
      async () => {
        const updated = await updateUser(dummyUserName, updatedDummyUser);
        expect(updated).toBe(true);
        const user = await getUser(dummyUserName);
        expect(user.toJSON()).toStrictEqual(updatedDummyUser.toJSON());
      },
  );

  test('Delete the dummy user.', async () => {
    await deleteUser(dummyUserName);
    const user = await getUser(dummyUserName);
    expect(user).toBe(undefined);
  });
});
