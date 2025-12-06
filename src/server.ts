import { Server } from 'http';
import app from './app';
import config from './config';
import logger from './utils/logger';
import prisma from './db/prisma';

const server: Server = app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`API prefix: ${config.apiPrefix}`);
});

// Graceful shutdown
const gracefulShutdown = async (): Promise<void> => {
  logger.info('Received shutdown signal, closing server gracefully...');

  server.close(async () => {
    logger.info('HTTP server closed');

    // Close database connection
    try {
      await prisma.$disconnect();
      logger.info('Database connection closed');
    } catch (error) {
      logger.error('Error closing database connection:', error);
    }

    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default server;

