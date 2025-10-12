import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new post (requires authentication)' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - no valid token' })
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: any) {
    return this.postsService.create(createPostDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts or filter by userId' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter posts by user ID', type: Number })
  @ApiResponse({ status: 200, description: 'Returns all posts or filtered by userId' })
  findAll(@Query('userId', ParseIntPipe) userId?: number) {
    if (userId) {
      return this.postsService.findByUserId(userId);
    }
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID', type: Number })
  @ApiResponse({ status: 200, description: 'Returns the post' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a post (only post owner)' })
  @ApiParam({ name: 'id', description: 'Post ID', type: Number })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - no valid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the post owner' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto, @CurrentUser() user: any) {
    return this.postsService.update(id, updatePostDto, user.id);
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a post (only post owner)' })
  @ApiParam({ name: 'id', description: 'Post ID', type: Number })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - no valid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the post owner' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.postsService.remove(id, user.id);
  }
}
