import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  private posts: Post[] = [
    {
      id: 1,
      userId: 1,
      title: '1 - 1',
      content: 'user 1, id 1',
    },
    {
      id: 2,
      userId: 1,
      title: '1 - 2',
      content: 'user 1, id 2',
    },
    {
      id: 3,
      userId: 2,
      title: '2 - 3',
      content: 'user 2, id 3',
    },
  ];
  create(createPostDto: CreatePostDto) {
    // new ID generation
    const newId = this.posts.length > 0 
      ? Math.max(...this.posts.map(p => p.id)) + 1 
      : 1;
    
    const newPost: Post = {
      id: newId,
      ...createPostDto,
    };
    
    this.posts.push(newPost);
    return newPost;
  }

  findAll() {
    return this.posts;
  }

  findByUserId(userId: number) {
    return this.posts.filter(post => post.userId === userId);
  }

  findOne(id: number) {
     const post = this.posts.find(post => post.id === id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const postIndex = this.posts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    this.posts[postIndex] = {
      ...this.posts[postIndex],
      ...updatePostDto
    };
    return this.posts[postIndex];
  }

  remove(id: number) {
    const postIndex = this.posts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    const deletedPost = this.posts[postIndex];
    this.posts.splice(postIndex, 1);
    return deletedPost;
  }
}
