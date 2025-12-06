import { Request, Response, NextFunction } from 'express';
import exampleService from '../services/example.service';
import { RequestHandler } from '../types';

class ExampleController {
  getAll: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await exampleService.getAll();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getById: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: { message: 'Invalid ID parameter' },
        });
        return;
      }

      const data = await exampleService.getById(id);

      if (!data) {
        res.status(404).json({
          success: false,
          error: { message: 'Example not found' },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  create: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, description } = req.body;

      if (!title) {
        res.status(400).json({
          success: false,
          error: { message: 'Title is required' },
        });
        return;
      }

      const data = await exampleService.create({
        title,
        ...(description && { description }),
      });

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  update: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: { message: 'Invalid ID parameter' },
        });
        return;
      }

      const { title, description } = req.body;

      const data = await exampleService.update(id, {
        title,
        description,
      });

      if (!data) {
        res.status(404).json({
          success: false,
          error: { message: 'Example not found' },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  delete: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: { message: 'Invalid ID parameter' },
        });
        return;
      }

      const deleted = await exampleService.delete(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: { message: 'Example not found' },
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Example deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new ExampleController();
