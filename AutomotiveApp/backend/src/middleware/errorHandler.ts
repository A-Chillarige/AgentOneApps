/**
 * Error handling middleware for the Automotive Service Reminder Agent
 */

import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../../shared/types/api';

/**
 * Handle 404 errors
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const response: ApiResponse<null> = {
    success: false,
    error: `Not Found - ${req.originalUrl}`
  };
  res.status(404).json(response);
};

/**
 * Handle all other errors
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  const response: ApiResponse<null> = {
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  };
  
  res.status(500).json(response);
};
