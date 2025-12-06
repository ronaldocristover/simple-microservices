import { Request, Response } from 'express';

class HealthController {
  check = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      success: true,
      message: 'Service is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  };
}

export default new HealthController();
