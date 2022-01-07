import {Router} from 'express';

import questionPostController
  from '../../../controllers/question/question_post';
import answerRouter from './answer';

const route = '/:qID';
/**
 * @type {Router} Express router object.
 */
const questionIDRouter = new Router();

// Set up next routes.
questionIDRouter.use(route, answerRouter);

// POST.
questionIDRouter.post(route, questionPostController);

const unsupportedMessage =
  `${route} only supports POST with user and question details.`;
  // DELETE. Unsupported.
questionIDRouter.delete(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// GET. Unsupported.
questionIDRouter.get(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// PUT. Unsupported.
questionIDRouter.put(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

export default questionIDRouter;
