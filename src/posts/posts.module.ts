import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { PostsRepository } from './posts.repository';
import { AuthModule } from '../auth/auth.module';
import { IsPostOwnerGuard } from '../auth/guards/is-post-owner.guard';

@Module({  
  imports: [PrismaModule, AuthModule],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    IsPostOwnerGuard, 
  ],
  exports: [PostsService],
})
export class PostsModule {}
