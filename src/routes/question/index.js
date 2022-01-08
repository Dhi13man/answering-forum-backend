import {Router} from 'express';
import {
  questionGetUsernameController,
} from '../../controllers/questions/question_get';

import questionPostController
  from '../../controllers/questions/question_post';
import questionIDRouter from './questionID';

const route = '/question';
/**
 * @type {Router} Express router object.
 */
const questionRouter = new Router();

// Set up next routes.
questionRouter.use(route, questionIDRouter);

// POST.
questionRouter.post(route, questionPostController);

// GET. Unsupported.
questionRouter.get(route, questionGetUsernameController);

const unsupportedMessage =
  `${route} only supports POST with user and question details.`;
// DELETE. Unsupported.
questionRouter.delete(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// PUT. Unsupported.
questionRouter.put(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

export default questionRouter;
