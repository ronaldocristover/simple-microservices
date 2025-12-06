import { PrismaClient, Prisma } from '@prisma/client';
import logger from '../utils/logger';
import config from '../config';

// Connection pool configuration
const connectionPoolConfig = {
    connection_limit: parseInt(process.env.DATABASE_CONNECTION_LIMIT || '10', 10),
    pool_timeout: parseInt(process.env.DATABASE_POOL_TIMEOUT || '10', 10),
};

const prisma = new PrismaClient({
    log: config.nodeEnv === 'development'
        ? [{ level: 'query', emit: 'event' }, { level: 'error', emit: 'event' }, { level: 'warn', emit: 'event' }]
        : [{ level: 'error', emit: 'event' }],
    datasources: {
        db: {
            url: config.database.url,
        },
    },
});

// Attach custom logger to Prisma events
if (config.nodeEnv === 'development') {
    prisma.$on('query' as never, (e: Prisma.QueryEvent) => {
        logger.debug(`[Prisma Query] ${e.query} - Duration: ${e.duration}ms`);
    });
}

prisma.$on('error' as never, (e: Prisma.QueryEvent | Prisma.LogEvent) => {
    if ('message' in e) {
        logger.error(`[Prisma Error] ${e.message}`, { target: 'target' in e ? e.target : undefined });
    } else {
        logger.error(`[Prisma Error]`, e);
    }
});

prisma.$on('warn' as never, (e: Prisma.QueryEvent | Prisma.LogEvent) => {
    if ('message' in e) {
        logger.warn(`[Prisma Warn] ${e.message}`, { target: 'target' in e ? e.target : undefined });
    } else {
        logger.warn(`[Prisma Warn]`, e);
    }
});

logger.info('Prisma Client initialized', {
    connectionPool: connectionPoolConfig,
    environment: config.nodeEnv,
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
    logger.info('Prisma Client disconnected');
});

// Exception handler for Prisma errors
export class PrismaExceptionHandler {
    static handle(error: unknown): {
        statusCode: number;
        message: string;
        code?: string;
    } {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2002':
                    return {
                        statusCode: 409,
                        message: 'Unique constraint violation',
                        code: error.code,
                    };
                case 'P2025':
                    return {
                        statusCode: 404,
                        message: 'Record not found',
                        code: error.code,
                    };
                case 'P2003':
                    return {
                        statusCode: 400,
                        message: 'Foreign key constraint violation',
                        code: error.code,
                    };
                case 'P2014':
                    return {
                        statusCode: 400,
                        message: 'Invalid relation',
                        code: error.code,
                    };
                case 'P2000':
                    return {
                        statusCode: 400,
                        message: 'Value too long for column',
                        code: error.code,
                    };
                case 'P2001':
                    return {
                        statusCode: 404,
                        message: 'Record does not exist',
                        code: error.code,
                    };
                default:
                    logger.error('Unhandled Prisma error', { code: error.code, meta: error.meta });
                    return {
                        statusCode: 500,
                        message: 'Database error occurred',
                        code: error.code,
                    };
            }
        }

        if (error instanceof Prisma.PrismaClientUnknownRequestError) {
            logger.error('Unknown Prisma error', error);
            return {
                statusCode: 500,
                message: 'An unknown database error occurred',
            };
        }

        if (error instanceof Prisma.PrismaClientValidationError) {
            return {
                statusCode: 400,
                message: 'Invalid input data',
            };
        }

        if (error instanceof Prisma.PrismaClientInitializationError) {
            logger.error('Prisma initialization error', error);
            return {
                statusCode: 503,
                message: 'Database connection failed',
            };
        }

        // If it's not a Prisma error, re-throw it
        throw error;
    }

    static isPrismaError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
        return error instanceof Prisma.PrismaClientKnownRequestError;
    }
}

export default prisma;
