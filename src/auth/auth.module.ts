import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { jwtConstants } from './constants';
import { IdpModule } from '../idp/idp.module';
import { IdpAuthGuard } from './guards/idp-auth.guard';

@Module({
  imports: [
    UsersModule,
    IdpModule,
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
    LocalStrategy,
    JwtStrategy,
    IdpAuthGuard,
  ],
  exports: [AuthService, IdpAuthGuard],
})
export class AuthModule {}
