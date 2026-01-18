import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'prisma/prisma.service';
import { throwMappedPrismaError } from 'prisma/prisma-errors';

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    try {
      return await this.prisma.post.create({
        data: {
          ...createPostDto,
          userId,
        },
        include: {
          category: true,
        },
      });
    } catch (error) {
      throwMappedPrismaError(error, {
        P2003: () => {
          throw new NotFoundException('Category not found');
        },
      });
    }
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: {
        category: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.post.findMany({
      where: { userId },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      return await this.prisma.post.update({
        where: { id },
        data: updatePostDto,
        include: {
          category: true,
        },
      });
    } catch (error) {
      throwMappedPrismaError(error, {
        P2003: () => {
          throw new NotFoundException('Category not found');
        },
      });
    }
  }

  async remove(id: string) {
    return this.prisma.post.delete({
      where: { id },
      include: {
        category: true,
      },
    });
  }
}
