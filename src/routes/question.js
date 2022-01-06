import {Router} from 'express';

import questionController from '../controllers/question.js';

// Define express router.
const questionRouter = new Router();

// POST /login
questionRouter.post('/question', questionController);

const unsupportedMessage =
        '/question only supports POST with user and question details.';
// DELETE /login. Unsupported
questionRouter.delete('/question', (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// GET /login. Unsupported
questionRouter.get('/question', (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

// PUT /login. Unsupported
questionRouter.put('/question', (_, res) =>
  res.status(405).json({message: unsupportedMessage}),
);

export default questionRouter;
