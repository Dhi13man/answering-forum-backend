import UserData from '../../src/models/user_data.js';
import {
  getUser,
  createUser,
  deleteUser,
  updateUser,
} from '../../src/repositories/users.js';

describe('Users repository Tests', () => {
  // Database Override for tests
  const dummyDatabasePath = 'tests/database/users.test.json';

  // Dummy User Data
  const dummyUserName = 'dummy@UserName.com';
  const dummyUserPassword = 'dummyUserPassword';
  const dummyRegistrationName = 'dummyRegistrationName';
  const dummyUser = UserData.fromJSON({
    username: dummyUserName,
    password: dummyUserPassword,
    registration_name: dummyRegistrationName,
  });

  // Dummy Updated User Data
  const updatedDummyUserPassword = 'updatedDummyUserPassword';
  const updatedDummyRegistrationName = 'updatedDummyRegistrationName';
  const updatedDummyUser = UserData.fromJSON({
    username: dummyUserName,
    password: updatedDummyUserPassword,
    registration_name: updatedDummyRegistrationName,
  });

  // Response messages to be expected
  const alreadyExistsMessage =
        `User with username ${dummyUserName} already exists.`;
  const doesNotExistMessage =
        `User with username ${dummyUserName} doesn't exist.`;
  const invalidUserMessage = 'username and password are required.';

  // Define tests
  test('Create a dummy user.', async () => {
    const created = await createUser(dummyUser, dummyDatabasePath);
    expect(created).toBe(true);
  });

  test('Attempt to create a duplicate dummy user.', async () => {
    await expect(
        () => createUser(dummyUser, dummyDatabasePath),
    ).rejects
        .toThrowError(alreadyExistsMessage);
  });

  test('Attempt to create an user with no username.', async () => {
    await expect(
        () => createUser(
            UserData.fromJSON({...dummyUser.toJSON(), username: ''}),
            dummyDatabasePath,
        ),
    ).rejects
        .toThrowError(invalidUserMessage);
  });

  test('Get the dummy user.', async () => {
    const user = await getUser(dummyUserName, dummyDatabasePath);
    expect(user.toJSON()).toStrictEqual(dummyUser.toJSON());
  });

  test(
      'Update the dummy user and validate it\'s updated data.',
      async () => {
        const updated = await updateUser(
            dummyUserName,
            updatedDummyUser,
            dummyDatabasePath,
        );
        expect(updated).toBe(true);
        const user = await getUser(dummyUserName, dummyDatabasePath);
        expect(user.toJSON()).toStrictEqual(updatedDummyUser.toJSON());
      },
  );

  test('Delete the dummy user.', async () => {
    await deleteUser(dummyUserName, dummyDatabasePath);
    const user = await getUser(dummyUserName, dummyDatabasePath);
    expect(user).toBe(undefined);
  });

  test('Attempt to update a non-existent user.', async () => {
    await expect(
        () => updateUser(dummyUserName, updatedDummyUser, dummyDatabasePath),
    ).rejects
        .toThrowError(doesNotExistMessage);
  });

  test('Attempt to delete a non-existent user.', async () => {
    await expect(
        () => deleteUser(dummyUserName, dummyDatabasePath),
    ).rejects
        .toThrowError(doesNotExistMessage);
  });
});
