import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(slug: string) {
    try {
      return await this.categoriesRepository.create(slug);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Category slug already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.categoriesRepository.remove(id);
  }

  async subscribe(categoryId: string, userId: string) {
    const category = await this.categoriesRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    try {
      await this.categoriesRepository.createSubscription(userId, categoryId);
      return { message: 'Subscribed', categoryId };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Already subscribed');
      }
      throw error;
    }
  }

  async unsubscribe(categoryId: string, userId: string) {
    const category = await this.categoriesRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const result = await this.categoriesRepository.removeSubscription(userId, categoryId);
    if (result.count === 0) {
      throw new NotFoundException('Subscription not found');
    }

    return { message: 'Unsubscribed', categoryId };
  }
}
