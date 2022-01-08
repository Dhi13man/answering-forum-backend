import {Router} from 'express';
import {questionGetIDController}
  from '../../../controllers/questions/question_get';

import questionPostController
  from '../../../controllers/questions/question_post';
import answerRouter from './answer';

const route = '/:qID';
/**
 * @type {Router} Express router object.
 */
const questionIDRouter = new Router();

// Set up next routes.
questionIDRouter.use(route, answerRouter);

// GET.
questionIDRouter.get(route, questionGetIDController);

// POST.
questionIDRouter.post(route, questionPostController);

const unsupportedMessage =
  `/{qID} only supports POST with user and question details.`;
// DELETE. Unsupported.
questionIDRouter.delete(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// PUT. Unsupported.
questionIDRouter.put(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

export default questionIDRouter;
