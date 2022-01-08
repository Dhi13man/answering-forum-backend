import {AnswerData} from '../../src/models/answer_data';
import {
  createAnswer,
  deleteAnswer,
  getAnswer,
  updateAnswer,
  getAllAnswersForQuestion,
} from '../../src/repositories/answers';

describe('Answers repository Tests', () => {
  // Database Override for tests
  const dummyDatabasePath = 'tests/database/answers.test.json';

  // Dummy Answer Data
  const dummyQID = '-1';
  const dummyAnswerText = 'dummyAnswerText';
  const dummyUName = 'dummy@UserName.com';
  const dummyAnswer = AnswerData.fromJSON({
    answer: dummyAnswerText,
    questionID: dummyQID,
    username: dummyUName,
  });

  // Dummy Updated Answer Data
  const updatedDummyAnswerText = 'updatedDummyAnswerText';
  const updatedDummyAnswer = AnswerData.fromJSON({
    answer: updatedDummyAnswerText,
    questionID: dummyQID,
    username: dummyUName,
  });

  // Response messages to be expected
  const alreadyExistsMessage =
   `Answer by user ${dummyUName} for quesiton ID ${dummyQID} already exists.`;
  const doesNotExistMessage =
   `Answer by user ${dummyUName} for quesiton ID ${dummyQID} doesn't exist.`;
  const invalidAnswerMessage =
   'Answer must have answer text and associated question ID must be provided.';

  // Define tests
  test('Create a dummy answer.', async () => {
    const created = await createAnswer(dummyAnswer, dummyDatabasePath);
    expect(created).toBe(true);
  });

  test('Attempt to create a duplicate dummy answer.', async () => {
    await expect(
        () => createAnswer(dummyAnswer, dummyDatabasePath),
    ).rejects
        .toThrowError(alreadyExistsMessage);
  });

  test('Attempt to create a answer with no title.', async () => {
    await expect(
        () => createAnswer(
            AnswerData.fromJSON({...dummyAnswer.toJSON(), answer: ''}),
            dummyDatabasePath,
        ),
    ).rejects
        .toThrowError(invalidAnswerMessage);
  });

  test('Get the dummy answer.', async () => {
    const answer = await getAnswer(dummyQID, dummyUName, dummyDatabasePath);
    expect(answer.toJSON()).toStrictEqual(dummyAnswer.toJSON());
  });

  test(
      'Update the dummy answer and validate it\'s updated data.',
      async () => {
        const updated = await updateAnswer(
            updatedDummyAnswer,
            dummyDatabasePath,
        );
        expect(updated).toBe(true);
        const answer = await getAnswer(dummyQID, dummyUName, dummyDatabasePath);
        expect(answer.toJSON()).toStrictEqual(updatedDummyAnswer.toJSON());
      },
  );

  test('Get all answers for question before deleting answer.', async () => {
    const answers = await getAllAnswersForQuestion(dummyQID, dummyDatabasePath);
    expect(answers.length).toBe(1);
    expect(answers[0].toJSON()).toStrictEqual(updatedDummyAnswer.toJSON());
  });

  test('Delete the dummy answer.', async () => {
    await deleteAnswer(dummyQID, dummyUName, dummyDatabasePath);
    const user = await getAnswer(dummyQID, dummyUName, dummyDatabasePath);
    expect(user).toBe(undefined);
  });

  test('Get all answers for question after deleting answer.', async () => {
    const answers = await getAllAnswersForQuestion(dummyQID, dummyDatabasePath);
    expect(answers.length).toBe(0);
  });

  test('Attempt to update a non-existent answer.', async () => {
    await expect(
        () => updateAnswer(updatedDummyAnswer, dummyDatabasePath),
    ).rejects
        .toThrowError(doesNotExistMessage);
  });

  test('Attempt to delete a non-existent answer.', async () => {
    await expect(
        () => deleteAnswer(dummyQID, dummyUName, dummyDatabasePath),
    ).rejects
        .toThrowError(doesNotExistMessage);
  });
});
