import { Request, Response, NextFunction } from 'express';

export interface Config {
  port: number;
  nodeEnv: string;
  apiPrefix: string;
  database: {
    url: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    stack?: string;
  };
}

export interface ErrorWithStatus extends Error {
  statusCode?: number;
}

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export type ErrorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

