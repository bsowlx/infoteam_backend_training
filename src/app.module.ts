import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from '@app/prisma';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GoogleStrategy } from './auth/strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available everywhere
    }),
    PostsModule,
    CategoriesModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
