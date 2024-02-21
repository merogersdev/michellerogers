import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import crypto from 'crypto';

import { env } from './config/env.config';
import connectDB from './config/db.config';
import errorHandler, { notFoundHandler } from './middleware/error.middleware';

import healthRouter from './routes/health.route';
import userRouter from './routes/user.route';
import authRouter from './routes/auth.route';
import docRouter from './routes/doc.route';

console.log(
  crypto.createHmac('sha256', [env.CRYPTO_SECRET, 'password123'].join('/')).update(env.CRYPTO_SECRET).digest('hex'),
);

// Connect to DB
connectDB();

const app = express();

// Middleware
if (env.NODE_ENV !== 'production') app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(helmet());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/docs', docRouter);

// 404 Handler
app.use('*', notFoundHandler);

// Error Handler
app.use(errorHandler);

export default app;