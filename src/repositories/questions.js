import fs from 'fs/promises';

import {QuestionInputModel} from '../models/question_data.js';

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
 * @param {QuestionInputModel} questionInputData - The input data of the
 * question to be created.
 * @param {string} dbPathOverride - Override of the path to the
 * database to be used. Defaults to the default defined path questionsDBPath.
 * @return {Promise<boolean>} A promise that resolves to whether the
 * question was successfully created.
 */
export const createQuestion = async (
    questionInputData,
    dbPathOverride=questionsDBPath,
) => {
  questionInputData = QuestionInputModel.fromJSON(questionInputData.toJSON());
  const questions = await getDatabase(dbPathOverride);
  const question = questionInputData.question;
  questions[question.question_id] = question.toJSON();
  fs.writeFile(dbPathOverride, JSON.stringify(questions));
  return true;
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
