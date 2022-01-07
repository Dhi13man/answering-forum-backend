import {Router} from 'express';

import questionPostController
  from '../../controllers/question/question_post';
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

const unsupportedMessage =
  `${route} only supports POST with user and question details.`;
// DELETE. Unsupported.
questionRouter.delete(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// GET. Unsupported.
questionRouter.get(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// PUT. Unsupported.
questionRouter.put(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

export default questionRouter;
