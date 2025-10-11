import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PostsService } from '../../posts/posts.service';

@Injectable()
export class IsPostOwnerGuard implements CanActivate {
  constructor(private postsService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const postId = parseInt(request.params.id);

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const post = await this.postsService.findOne(postId);

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    if (post.userId !== user.id) {
      throw new ForbiddenException('You can only modify your own posts');
    }

    return true;
  }
}
