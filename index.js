import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';

import loginRouter from './src/routes/login.js';
import registerRouter from './src/routes/register.js';
import questionRouter from './src/routes/question.js';

// Define express app.
const app = express();

// Set up Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Set up Routes
app.get(
    '/',
    (_, res) => res.status(404).json({message: 'Not an active endpoint'}),
);
app.use('/', loginRouter);
app.use('/', registerRouter);
app.use('/', questionRouter);

// Set up Port
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

export default app;
