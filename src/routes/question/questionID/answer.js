import {Router} from 'express';

import questionController from '../../../controllers/question_post';

const route = '/answer';
/**
 * @type {Router} Express router object.
 */
const answerRouter = new Router({mergeParams: true});

// POST.
answerRouter.post(route, questionController);

const unsupportedMessage =
  `${route} only supports POST with user and answer details.`;
// DELETE. Unsupported.
answerRouter.delete(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// GET. Unsupported.
answerRouter.get(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// PUT. Unsupported.
answerRouter.put(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

export default answerRouter;
