import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  async create(createPostDto: CreatePostDto & { userId: number }) {
    return this.postsRepository.create(createPostDto);
  }

  async findAll() {
    return this.postsRepository.findAll();
  }

  async findByUserId(userId: number) {
    return this.postsRepository.findByUserId(userId);
  }

  async findOne(id: number) {
    return this.postsRepository.findOne(id);
  }
  async findOneOrFail(id: number) {
    const post = await this.postsRepository.findOne(id);
    if (!post) {  
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.findOneOrFail(id);
    return this.postsRepository.update(id, updatePostDto);
  }

  async remove(id: number) {
    await this.findOneOrFail(id);
    return this.postsRepository.remove(id);
  }
}
