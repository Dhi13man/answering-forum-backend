import {QuestionData} from '../../src/models/question_data';
import {
  createQuestion, deleteQuestion, getQuestion, updateQuestion,
} from '../../src/repositories/questions';

describe('Questions repository Tests', () => {
  // Database Override for tests
  const dummyDatabasePath = 'tests/database/questions.test.json';

  // Dummy Question Data
  const dummyID = '-1';
  const dummyTitle = 'dummyTitle';
  const dummyBody = 'dummyBody';
  const dummyQuestion = QuestionData.fromJSON({
    title: dummyTitle,
    body: dummyBody,
    questionID: dummyID,
  });

  // Dummy Updated Question Data
  const updatedDummyTitle = 'updatedDummyTitle';
  const updatedDummyBody = 'updatedDummyBody';
  const updatedDummyQuestion = QuestionData.fromJSON({
    title: updatedDummyTitle,
    body: updatedDummyBody,
    questionID: dummyID,
  });

  // Response messages to be expected
  const alreadyExistsMessage =
        `Question with ID ${dummyID} already exists.`;
  const doesNotExistMessage =
        `Question with ID ${dummyID} doesn't exist.`;
  const invalidQuestionMessage =
        'Question must have a title and should have generated an ID.';

  // Define tests
  test('Create a dummy question.', async () => {
    const created = await createQuestion(dummyQuestion, dummyDatabasePath);
    expect(created).toBe(true);
  });

  test('Attempt to create a duplicate dummy question.', async () => {
    await expect(
        () => createQuestion(dummyQuestion, dummyDatabasePath),
    ).rejects
        .toThrowError(alreadyExistsMessage);
  });

  test('Attempt to create a question with no title.', async () => {
    await expect(
        () => createQuestion(
            QuestionData.fromJSON({...dummyQuestion.toJSON(), title: ''}),
            dummyDatabasePath,
        ),
    ).rejects
        .toThrowError(invalidQuestionMessage);
  });

  test('Get the dummy question.', async () => {
    const question = await getQuestion(dummyID, dummyDatabasePath);
    expect(question.toJSON()).toStrictEqual(dummyQuestion.toJSON());
  });

  test(
      'Update the dummy question and validate it\'s updated data.',
      async () => {
        const updated = await updateQuestion(
            dummyID,
            updatedDummyQuestion,
            dummyDatabasePath,
        );
        expect(updated).toBe(true);
        const question = await getQuestion(dummyID, dummyDatabasePath);
        expect(question.toJSON()).toStrictEqual(updatedDummyQuestion.toJSON());
      },
  );

  test('Delete the dummy question.', async () => {
    await deleteQuestion(dummyID, dummyDatabasePath);
    const user = await getQuestion(dummyID, dummyDatabasePath);
    expect(user).toBe(undefined);
  });

  test('Attempt to update a non-existent question.', async () => {
    await expect(
        () => updateQuestion(dummyID, updatedDummyQuestion, dummyDatabasePath),
    ).rejects
        .toThrowError(doesNotExistMessage);
  });

  test('Attempt to delete a non-existent question.', async () => {
    await expect(
        () => deleteQuestion(dummyID, dummyDatabasePath),
    ).rejects
        .toThrowError(doesNotExistMessage);
  });
});
