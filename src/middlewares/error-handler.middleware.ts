import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { ErrorHandler, ErrorWithStatus } from '../types';

const errorHandler: ErrorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

export default errorHandler;

