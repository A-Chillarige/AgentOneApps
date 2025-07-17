/**
 * Express application setup for the Automotive Service Reminder Agent
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { SERVER_CONFIG } from './config';
import routes from './routes';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

// Create Express application
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: SERVER_CONFIG.corsOrigin })); // CORS
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request body
app.use(morgan(SERVER_CONFIG.nodeEnv === 'production' ? 'combined' : 'dev')); // Request logging

// Routes
Object.values(routes).forEach(route => {
  app.use(route.path, route.router);
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
