import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    try {
      return await this.postsRepository.create(createPostDto, userId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new NotFoundException('Category not found');
      }
      throw error;
    }
  }

  async findAll() {
    return this.postsRepository.findAll();
  }

  async findByUserId(userId: string) {
    return this.postsRepository.findByUserId(userId);
  }

  async findOne(id: string) {
    return this.postsRepository.findOne(id);
  }
  async findOneOrFail(id: string) {
    const post = await this.postsRepository.findOne(id);
    if (!post) {  
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.findOneOrFail(id);
    
    // Check ownership
    if (post.userId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }
    
    try {
      return await this.postsRepository.update(id, updatePostDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new NotFoundException('Category not found');
      }
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    const post = await this.findOneOrFail(id);
    
    // Check ownership
    if (post.userId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    
    return this.postsRepository.remove(id);
  }
}
