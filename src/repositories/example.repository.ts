import prisma, { PrismaExceptionHandler } from '../db/prisma';
import { Example, Prisma } from '@prisma/client';

class ExampleRepository {
    async findAll(): Promise<Example[]> {
        try {
            return await prisma.example.findMany({
                orderBy: { createdAt: 'desc' },
            });
        } catch (error) {
            if (PrismaExceptionHandler.isPrismaError(error)) {
                throw error;
            }
            throw error;
        }
    }

    async findById(id: number): Promise<Example | null> {
        try {
            return await prisma.example.findUnique({
                where: { id },
            });
        } catch (error) {
            if (PrismaExceptionHandler.isPrismaError(error)) {
                throw error;
            }
            throw error;
        }
    }

    async create(data: Prisma.ExampleCreateInput): Promise<Example> {
        try {
            return await prisma.example.create({
                data,
            });
        } catch (error) {
            if (PrismaExceptionHandler.isPrismaError(error)) {
                throw error;
            }
            throw error;
        }
    }

    async update(id: number, data: Prisma.ExampleUpdateInput): Promise<Example | null> {
        try {
            return await prisma.example.update({
                where: { id },
                data,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null; // Record not found
            }
            if (PrismaExceptionHandler.isPrismaError(error)) {
                throw error;
            }
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            await prisma.example.delete({
                where: { id },
            });
            return true;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return false; // Record not found
            }
            if (PrismaExceptionHandler.isPrismaError(error)) {
                throw error;
            }
            throw error;
        }
    }
}

export default new ExampleRepository();
