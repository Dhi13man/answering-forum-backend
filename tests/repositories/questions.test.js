import {QuestionData} from '../../src/models/question_data';
import {
  createQuestion,
  deleteQuestion,
  getQuestion,
  updateQuestion,
  getAllQuestionsForUsername,
  getNextQuestionID,
} from '../../src/repositories/questions';

describe('Questions repository Tests', () => {
  // Database Override for tests
  const dummyDatabasePath = 'tests/database/questions.test.json';

  // Dummy Question Data
  const dummyID = '-1';
  const dummyTitle = 'dummyTitle';
  const dummyBody = 'dummyBody';
  const dummyUserName = 'dummy@UserName.com';
  const dummyQuestion = QuestionData.fromJSON({
    title: dummyTitle,
    body: dummyBody,
    questionID: dummyID,
    username: dummyUserName,
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
  test('getNextQuestionID should return 1.', async () => {
    expect(await getNextQuestionID(dummyDatabasePath)).toBe(1);
  });

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

  test('Get all questions for dummy user before deletion.', async () => {
    const questions = await getAllQuestionsForUsername(
        dummyUserName, dummyDatabasePath,
    );
    expect(questions.length).toBe(1);
    expect(questions[0].toJSON()).toStrictEqual(dummyQuestion.toJSON());
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
        expect(question.title).toStrictEqual(updatedDummyQuestion.title);
        expect(question.body).toStrictEqual(updatedDummyQuestion.body);
      },
  );

  test('getNextQuestionID should return 2.', async () => {
    expect(await getNextQuestionID(dummyDatabasePath)).toBe(2);
  });

  test('Delete the dummy question.', async () => {
    await deleteQuestion(dummyID, dummyDatabasePath);
    const user = await getQuestion(dummyID, dummyDatabasePath);
    expect(user).toBe(undefined);
  });

  test('Get all questions for dummy user after deletion.', async () => {
    const questions = await getAllQuestionsForUsername(
        dummyUserName, dummyDatabasePath,
    );
    expect(questions.length).toBe(0);
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
