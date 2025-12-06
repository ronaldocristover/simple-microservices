import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from '../types';

const notFound: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
    },
  });
};

export default notFound;

