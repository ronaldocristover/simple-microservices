import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

logger.info('Prisma Client initialized');

// Handle graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
    logger.info('Prisma Client disconnected');
});

export default prisma;
