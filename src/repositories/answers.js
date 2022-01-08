import fs from 'fs/promises';

import {AnswerData} from '../models/answer_data';

/**
 * Path to the Users database.
 */
const answersDBPath = './src/database/answers.json';

/**
 * Create a new answer in the database.
 * @param {AnswerData} answer - The input data of the
 * answer to be created.
 * @param {string} dbPathOverride - Override of the path to the
 * database to be used. Defaults to the default defined path answersDBPath.
 * @return {Promise<boolean>} A promise that resolves to whether the
 * answer was successfully created.
 * @throws {Error} If answer data is invalid.
 */
export const createAnswer = async (answer, dbPathOverride=answersDBPath) => {
  const answers = await getDatabase(dbPathOverride);
  if (answer.answer.length === 0 || !answer.question_id) {
    throw invalidAnswerError();
  }
  const aID = getAnswerID(answer.username, answer.question_id);
  if (answers[aID]) {
    throw alreadyExistsError(aID);
  }
  answers[aID] = answer.toJSON();
  fs.writeFile(dbPathOverride, JSON.stringify(answers));
  return true;
};

/**
 * Fetch an answer from the database using the question ID and the username
 * of the user who posted it.
 * @param {string} questionID - The input data of the
 * answer to be created.
 * @param {string} username - The username of the user who posted the answer.
 * @param {string} dbPathOverride - Override of the path to the
 * database to be used. Defaults to the default defined path answersDBPath.
 * @return {Promise<AnswerData>} A promise that resolves to the answer data.
 */
export const getAnswer = async (
    questionID,
    username,
    dbPathOverride=answersDBPath,
) => {
  const answers = await getDatabase(dbPathOverride);
  const adJSON = answers[getAnswerID(username, questionID)];
  return adJSON ? AnswerData.fromJSON(adJSON) : undefined;
};

/**
 * Gets all answers posted for the question identified by the given ID.
 * @param {string} questionID - The ID of the question to get answers for.
 * @param {string} dbPathOverride - Override of the path to the database
 * to be used. Defaults to the default defined path answersDBPath.
 * @return {Promise<AnswerData[]>} A promise that resolves to an array of
 * answer data objects for the question.
 */
export const getAllAnswersForQuestion = async (
    questionID,
    dbPathOverride=answersDBPath,
) => {
  const answers = await getDatabase(dbPathOverride);
  const answerIDs = Object.keys(answers).filter(
      (answerID) => answerID.split(':')[0] === questionID,
  );
  return answerIDs.map((answerID) => AnswerData.fromJSON(answers[answerID]));
};

/**
 * Update an existing answer in the database.
 * @param {AnswerData} answer - The data of the answer to be updated.
 * answer. question_id is ignored
 * @param {string} dbPathOverride - Override of the path to the
 * database to be used. Defaults to the default defined path answersDBPath.
 * @return {Promise<boolean>} A promise that resolves to whether the
 * answer was successfully updated.
 * @throws {Error} If the answer does not exist.
 */
export const updateAnswer = async (answer, dbPathOverride=answersDBPath) => {
  const answers = await getDatabase(dbPathOverride);
  if (answer.answer.length === 0) {
    throw invalidAnswerError();
  }
  const aID = getAnswerID(answer.username, answer.question_id);
  if (!answers[aID]) {
    throw doesNotExistError(aID);
  }
  answers[aID] = {
    ...answer.toJSON(),
    'question-ID': answers[aID]['question-id'],
  };
  fs.writeFile(dbPathOverride, JSON.stringify(answers));
  return true;
};

/**
 * Deletes an answer completely from the database if it exists.
 * @param {string} aID - ID of the answer to be deleted.
 * @param {string} dbPathOverride - Override of the path to the
 * database to be used. Defaults to the default defined path usersDBPath.
 * @return {Promise<void>} A promise that resolves when the user is deleted.
 * @throws {Error} An error object if the user does not exist.
 */
export const deleteAnswer = async (aID, dbPathOverride=answersDBPath) => {
  const answers = await getDatabase(dbPathOverride);
  if (!answers[aID]) {
    throw doesNotExistError(aID);
  }
  delete answers[aID];
  fs.writeFile(dbPathOverride, JSON.stringify(answers));
};

/**
 * Generates the ID of the answer from the username of the user posting it
 * and the ID of the question it is answering.
 *
 * Won't cause any issues because the username is guaranteed to be a valid
 * e-mail address and the ID of the associated question is guaranteed to be
 * a valid number.
 * @param {string} username - The username of the user who posted the answer.
 * @param {string} questionID - The ID of the question the answer is answering.
 * @return {string} The ID of the answer.
 */
const getAnswerID = (username, questionID) => questionID + ':' + username;

/**
 * Returns a database object as an asynchronous promise.
 * @param {string} dbPath - The path of the database to be fetched.
 * @param {string} dbPathOverride - Override of the path to the
 * database to be used. Defaults to the default defined path answersDBPath.
 * @return {Promise<object>} A promise that resolves to the database json.
 */
const getDatabase = async (dbPath=answersDBPath) =>
  JSON.parse(await fs.readFile(dbPath, 'utf-8'));

/**
 * Creates error that is thrown when answer data is invalid.
 * @return {Error} An error object for invalid answers.
 */
const invalidAnswerError = () =>
  new Error('Answer must have answer text and question ID must be provided.');

/**
 * Creates error that is thrown when the answer corresponding to the ID.
 * already exists.
 * @param {string} id - ID of the answer that already exists.
 * @return {Error} An error object for already existing answers.
 */
const alreadyExistsError = (id) =>
  new Error(`Answer with ID ${id} already exists.`);

/**
 * Creates error that is thrown when the answer corresponding to the ID.
 * does not exist.
 * @param {string} id - ID of the answer that does not exist.
 * @return {Error} An error object for non-existing answers.
 */
const doesNotExistError = (id) =>
  new Error(`Answer with ID ${id} doesn't exist.`);
