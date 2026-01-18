import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(slug: string) {
    return this.categoriesRepository.create(slug);
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

    await this.categoriesRepository.createSubscription(userId, categoryId);
    return { message: 'Subscribed', categoryId };
  }

  async unsubscribe(categoryId: string, userId: string) {
    const category = await this.categoriesRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const result = await this.categoriesRepository.removeSubscription(
      userId,
      categoryId,
    );
    if (result.count === 0) {
      throw new NotFoundException('Subscription not found');
    }

    return { message: 'Unsubscribed', categoryId };
  }
}
