import {Router} from 'express';

import registerController from '../controllers/register.js';

// Define express router.
const registerRouter = new Router();

// POST /login
registerRouter.post('/register', registerController);

const unsupportedMessage = '/register only supports POST with user data.';
// DELETE /login. Unsupported
registerRouter.delete('/register', (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// GET /login. Unsupported
registerRouter.get('/register', (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// PUT /login. Unsupported
registerRouter.put('/register', (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

export default registerRouter;
