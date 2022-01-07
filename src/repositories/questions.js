import fs from 'fs/promises';

import {QuestionData} from '../models/question_data';

/**
 * Path to the Users database.
 */
const questionsDBPath = './src/database/questions.json';

/**
 * Get the ID of the next question to be stored in the database.
 * Implements autoincrement key strategy.
 * @param {string} dbPathOverride - Override of the path to the
 * database to be used. Defaults to the default defined path questionsDBPath.
 * @return {Promise<number>} A promise that resolves to the next question ID.
 */
export const getNextQuestionID = async (dbPathOverride=questionsDBPath) => {
  const questions = await getDatabase(dbPathOverride);
  return Object.keys(questions).length + 1;
};

/**
 * Create a new question in the database.
 * @param {QuestionData} question - The input data of the
 * question to be created.
 * @param {string} dbPathOverride - Override of the path to the
 * database to be used. Defaults to the default defined path questionsDBPath.
 * @return {Promise<boolean>} A promise that resolves to whether the
 * question was successfully created.
 * @throws {Error} If question data is invalid.
 */
export const createQuestion = async (
    question,
    dbPathOverride=questionsDBPath,
) => {
  const questions = await getDatabase(dbPathOverride);
  if (question.title.length === 0 || !question.question_id) {
    throw invalidQuestionError();
  }
  if (questions[question.question_id]) {
    throw alreadyExistsError(question.question_id);
  }
  questions[question.question_id] = question.toJSON();
  fs.writeFile(dbPathOverride, JSON.stringify(questions));
  return true;
};

/**
 * Fetch a question from the database.
 * @param {string} questionID - The input data of the
 * question to be created.
 * @param {string} dbPathOverride - Override of the path to the
 * database to be used. Defaults to the default defined path questionsDBPath.
 * @return {Promise<QuestionData>} A promise that resolves to the question data.
 */
export const getQuestion = async (
    questionID,
    dbPathOverride=questionsDBPath,
) => {
  const questions = await getDatabase(dbPathOverride);
  const qdJSON = questions[questionID];
  return qdJSON ? QuestionData.fromJSON(qdJSON) : undefined;
};

/**
 * Update a new question in the database.
 * @param {string} questionID - The ID of the question to be updated.
 * @param {QuestionData} question - The input data of the
 * question to be updated. question.question_id is ignored
 * @param {string} dbPathOverride - Override of the path to the
 * database to be used. Defaults to the default defined path questionsDBPath.
 * @return {Promise<boolean>} A promise that resolves to whether the
 * question was successfully updated.
 * @throws {Error} If the question does not exist.
 */
export const updateQuestion = async (
    questionID,
    question,
    dbPathOverride=questionsDBPath,
) => {
  const questions = await getDatabase(dbPathOverride);
  if (question.title.length === 0) {
    throw invalidQuestionError();
  }
  if (!questions[questionID]) {
    throw doesNotExistError(questionID);
  }
  questions[questionID] = {
    ...question.toJSON(),
    'question-ID': questionID,
  };
  fs.writeFile(dbPathOverride, JSON.stringify(questions));
  return true;
};

/**
 * Deletes a question completely from the database if they exist.
 * @param {string} questionID - ID of the user to be deleted.
 * @param {string} dbPathOverride - Override of the path to the
 * database to be used. Defaults to the default defined path usersDBPath.
 * @return {Promise<void>} A promise that resolves when the user is deleted.
 * @throws {Error} An error object if the user does not exist.
 */
export const deleteQuestion = async (
    questionID,
    dbPathOverride=questionsDBPath,
) => {
  const questions = await getDatabase(dbPathOverride);
  if (!questions[questionID]) {
    throw doesNotExistError(questionID);
  }
  delete questions[questionID];
  fs.writeFile(dbPathOverride, JSON.stringify(questions));
};

/**
 * Returns a database object as an asynchronous promise.
 * @param {string} dbPath - The path of the database to be fetched.
 * @param {string} dbPathOverride - Override of the path to the
 * database to be used. Defaults to the default defined path questionsDBPath.
 * @return {Promise<object>} A promise that resolves to the database json.
 */
const getDatabase = async (dbPath=questionsDBPath) =>
  JSON.parse(await fs.readFile(dbPath, 'utf-8'));

/**
 * Creates error that is thrown when question data is invalid.
 * @return {Error} An error object for invalid questions.
 */
const invalidQuestionError = () =>
  new Error('Question must have a title and should have generated an ID.');

/**
 * Creates error that is thrown when the question corresponding to the ID
 * already exists.
 * @param {string} id - ID of the question that already exists.
 * @return {Error} An error object for already existing questions.
 */
const alreadyExistsError = (id) =>
  new Error(`Question with ID ${id} already exists.`);

/**
 * Creates error that is thrown when the question corresponding to the ID
 * does not exist.
 * @param {string} id - ID of the question that does not exist.
 * @return {Error} An error object for non-existing questions.
 */
const doesNotExistError = (id) =>
  new Error(`Question with ID ${id} doesn't exist.`);
