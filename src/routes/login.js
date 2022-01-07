import {Router} from 'express';

import loginPostController from '../controllers/login_post';

const route = '/login';
/**
 * @type {Router} Express router object.
 */
const loginRouter = new Router();

// POST.
loginRouter.post(route, loginPostController);

const unsupportedMessage = `${route} only supports POST with user credentials.`;
// DELETE. Unsupported.
loginRouter.delete(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// GET. Unsupported.
loginRouter.get(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// PUT. Unsupported.
loginRouter.put(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

export default loginRouter;
