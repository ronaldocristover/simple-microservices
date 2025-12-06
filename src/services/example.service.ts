import exampleRepository from '../repositories/example.repository';
import { Example, Prisma } from '@prisma/client';
import logger from '../utils/logger';

class ExampleService {
  async getAll(): Promise<Example[]> {
    logger.info('Service: Fetching all examples');
    return await exampleRepository.findAll();
  }

  async getById(id: number): Promise<Example | null> {
    logger.info(`Service: Fetching example with id: ${id}`);
    return await exampleRepository.findById(id);
  }

  async create(data: Prisma.ExampleCreateInput): Promise<Example> {
    logger.info('Service: Creating example');
    return await exampleRepository.create(data);
  }

  async update(id: number, data: Prisma.ExampleUpdateInput): Promise<Example | null> {
    logger.info(`Service: Updating example with id: ${id}`);
    return await exampleRepository.update(id, data);
  }

  async delete(id: number): Promise<boolean> {
    logger.info(`Service: Deleting example with id: ${id}`);
    return await exampleRepository.delete(id);
  }
}

export default new ExampleService();
