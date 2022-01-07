import {Router} from 'express';

import loginController from '../controllers/login';

const route = '/login';
/**
 * @type {Router} Express router object.
 */
const loginRouter = new Router();

// POST.
loginRouter.post(route, loginController);

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
