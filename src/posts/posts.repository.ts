import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        userId,
      },
      include: {
        category: true,
      },
    });
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
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: {
        category: true,
      },
    });
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