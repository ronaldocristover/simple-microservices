import { Request, Response } from 'express';
import logger from '../utils/logger';

class HealthController {
  check = async (req: Request, res: Response): Promise<void> => {
    logger.info('Health check request received');
    res.status(200).json({
      success: true,
      message: 'Service is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  };
}

export default new HealthController();

