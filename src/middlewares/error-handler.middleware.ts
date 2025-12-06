import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { ErrorHandler, ErrorWithStatus } from '../types';
import { PrismaExceptionHandler } from '../db/prisma';
import { Prisma } from '@prisma/client';

const errorHandler: ErrorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError || 
      err instanceof Prisma.PrismaClientUnknownRequestError ||
      err instanceof Prisma.PrismaClientValidationError ||
      err instanceof Prisma.PrismaClientInitializationError) {
    const handledError = PrismaExceptionHandler.handle(err);
    
    logger.error('[Prisma Error]', {
      code: 'code' in handledError ? handledError.code : undefined,
      message: handledError.message,
      originalError: err.message,
    });

    res.status(handledError.statusCode).json({
      success: false,
      error: {
        message: handledError.message,
        ...(process.env.NODE_ENV === 'development' && { 
          code: handledError.code,
          stack: err.stack 
        }),
      },
    });
    return;
  }

  // Handle other errors
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
