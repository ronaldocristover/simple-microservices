import winston from 'winston';
import config from '../config';

const isDevelopment = config.nodeEnv === 'development';

// Define log format
const logFormat = isDevelopment
  ? winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf((info: winston.Logform.TransformableInfo) => {
      const { timestamp, level, message, ...meta } = info;
      const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
      return `${timestamp} [${level}]: ${message} ${metaStr}`;
    })
  )
  : winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  );

// Define log levels
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');

// Create Winston logger
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  defaultMeta: { service: 'simple-microservices' },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: logFormat,
    }),
    // In production, also write errors to a file
    ...(isDevelopment
      ? []
      : [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json()
          ),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json()
          ),
        }),
      ]),
  ],
  // Handle exceptions and rejections
  exceptionHandlers: isDevelopment
    ? [new winston.transports.Console()]
    : [
      new winston.transports.File({
        filename: 'logs/exceptions.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json()
        ),
      }),
    ],
  rejectionHandlers: isDevelopment
    ? [new winston.transports.Console()]
    : [
      new winston.transports.File({
        filename: 'logs/rejections.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json()
        ),
      }),
    ],
});

// Create a simple interface that matches the existing logger API
const loggerInterface = {
  info: (message: string, ...args: any[]) => {
    if (args.length > 0 && typeof args[0] === 'object') {
      logger.info(message, args[0]);
    } else {
      logger.info(message, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    if (args.length > 0 && typeof args[0] === 'object') {
      logger.error(message, args[0]);
    } else {
      logger.error(message, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (args.length > 0 && typeof args[0] === 'object') {
      logger.warn(message, args[0]);
    } else {
      logger.warn(message, ...args);
    }
  },
  debug: (message: string, ...args: any[]) => {
    if (args.length > 0 && typeof args[0] === 'object') {
      logger.debug(message, args[0]);
    } else {
      logger.debug(message, ...args);
    }
  },
};

export default loggerInterface;
