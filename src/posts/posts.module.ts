import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { PostsRepository } from './posts.repository';
import { AuthModule } from '../auth/auth.module';

@Module({  
  imports: [PrismaModule, AuthModule],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository
  ],
})
export class PostsModule {}
