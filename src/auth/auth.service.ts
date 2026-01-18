import {
  Injectable,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { IdpService } from '../idp/idp.service';
import { IdpLoginDto } from '../idp/dto/idp-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private idpService: IdpService,
  ) {}

  async register(registerDto: RegisterDto) {
    throw new NotImplementedException(
      'Local register is disabled. Use IDP login instead.',
    );
  }

  async validateUser(email: string, password: string): Promise<any> {
    throw new NotImplementedException(
      'Local login is disabled. Use IDP login instead.',
    );
  }

  async idpLogin(dto: IdpLoginDto) {
    const tokenData =
      await this.idpService.exchangeAuthorizationCodeFromDto(dto);
    const userInfo = await this.idpService.getUserInfo(tokenData.access_token);

    if (!userInfo?.sub || !userInfo.email || !userInfo.name) {
      throw new UnauthorizedException(
        'IDP userinfo is missing required fields',
      );
    }

    const user = await this.usersService.upsertFromIdp({
      sub: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
    });

    return {
      user: {
        id: user.id,
        sub: user.sub,
        email: user.email,
        name: user.name,
      },
      accessToken: tokenData.access_token,
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in,
      scope: tokenData.scope,
    };
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }
}
