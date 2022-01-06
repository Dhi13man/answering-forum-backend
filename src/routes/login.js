import {Router} from 'express';

import loginController from '../controllers/login.js';

// Define express router.
const loginRouter = new Router();

// POST /login
loginRouter.post('/login', loginController);

const unsupportedMessage = '/login only supports POST with user credentials.';
// DELETE /login. Unsupported
loginRouter.delete('/login', (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// GET /login. Unsupported
loginRouter.get('/login', (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// PUT /login. Unsupported
loginRouter.put('/login', (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

export default loginRouter;
