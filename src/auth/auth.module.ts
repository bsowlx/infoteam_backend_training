import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { jwtConstants } from './constants';
import { IsPostOwnerGuard } from './guards/is-post-owner.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { 
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,  // Register Local Strategy
    JwtStrategy,    // Register JWT Strategy
    IsPostOwnerGuard, // Register ownership guard
  ],
  exports: [AuthService, IsPostOwnerGuard],
})
export class AuthModule {}
