import {Router} from 'express';

import answerPostController
  from '../../../controllers/answers/answer_post';

const route = '/answer';
/**
 * @type {Router} Express router object.
 */
const answerRouter = new Router({mergeParams: true});

// POST.
answerRouter.post(route, (req, res) => answerPostController(req, res, 'POST'));

// PUT.
answerRouter.put(route, (req, res) => answerPostController(req, res, 'PUT'));

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

export default answerRouter;
