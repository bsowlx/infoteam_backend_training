import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { throwMappedPrismaError } from 'prisma/prisma-errors';

@Injectable()
export class CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async create(slug: string) {
    try {
      return await this.prisma.category.create({
        data: { slug },
      });
    } catch (error) {
      throwMappedPrismaError(error, {
        P2002: () => {
          throw new ConflictException('Category slug already exists');
        },
      });
    }
  }

  async findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async createSubscription(userId: string, categoryId: string) {
    try {
      return await this.prisma.categorySubscription.create({
        data: {
          userId,
          categoryId,
        },
      });
    } catch (error) {
      throwMappedPrismaError(error, {
        P2002: () => {
          throw new ConflictException('Already subscribed');
        },
      });
    }
  }

  async removeSubscription(userId: string, categoryId: string) {
    return this.prisma.categorySubscription.deleteMany({
      where: {
        userId,
        categoryId,
      },
    });
  }
}
