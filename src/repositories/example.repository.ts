import prisma from '../db/prisma';
import { Example, Prisma } from '@prisma/client';
import logger from '../utils/logger';

class ExampleRepository {
    async findAll(): Promise<Example[]> {
        logger.info('Repository: Fetching all examples from database');
        return await prisma.example.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: number): Promise<Example | null> {
        logger.info(`Repository: Fetching example with id: ${id}`);
        return await prisma.example.findUnique({
            where: { id },
        });
    }

    async create(data: Prisma.ExampleCreateInput): Promise<Example> {
        logger.info('Repository: Creating example data:', data);
        return await prisma.example.create({
            data,
        });
    }

    async update(id: number, data: Prisma.ExampleUpdateInput): Promise<Example | null> {
        logger.info(`Repository: Updating example with id: ${id}`, data);
        try {
            return await prisma.example.update({
                where: { id },
                data,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null; // Record not found
            }
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        logger.info(`Repository: Deleting example with id: ${id}`);
        try {
            await prisma.example.delete({
                where: { id },
            });
            return true;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return false; // Record not found
            }
            throw error;
        }
    }
}

export default new ExampleRepository();
