import {Router} from 'express';

import registerPostController from '../controllers/register_post';

const route = '/register';
/**
 * @type {Router} Express router object.
 */
const registerRouter = new Router();

// POST.
registerRouter.post(route, registerPostController);

const unsupportedMessage = `${route} only supports POST with user data.`;
// DELETE. Unsupported.
registerRouter.delete(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// GET. Unsupported.
registerRouter.get(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// PUT. Unsupported.
registerRouter.put(route, (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

export default registerRouter;
