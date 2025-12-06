import exampleRepository from '../repositories/example.repository';
import { Example, Prisma } from '@prisma/client';

class ExampleService {
  async getAll(): Promise<Example[]> {
    return await exampleRepository.findAll();
  }

  async getById(id: number): Promise<Example | null> {
    return await exampleRepository.findById(id);
  }

  async create(data: Prisma.ExampleCreateInput): Promise<Example> {
    return await exampleRepository.create(data);
  }

  async update(id: number, data: Prisma.ExampleUpdateInput): Promise<Example | null> {
    return await exampleRepository.update(id, data);
  }

  async delete(id: number): Promise<boolean> {
    return await exampleRepository.delete(id);
  }
}

export default new ExampleService();
