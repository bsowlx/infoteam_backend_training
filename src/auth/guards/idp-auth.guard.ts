import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { IdpService } from '../../idp/idp.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class IdpAuthGuard implements CanActivate {
  constructor(
    private readonly idpService: IdpService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization: string | undefined =
      request.headers?.authorization ?? request.headers?.Authorization;

    if (!authorization || typeof authorization !== 'string') {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Authorization header must be Bearer token');
    }

    const userInfo = await this.idpService.validateAccessToken(token);

    if (!userInfo?.sub || !userInfo.email || !userInfo.name) {
      throw new UnauthorizedException('Invalid user info from IDP');
    }

    const user = await this.usersService.upsertFromIdp({
      sub: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
    });

    request.user = {
      id: user.id,
      sub: user.sub,
      email: user.email,
      name: user.name,
    };

    return true;
  }
}
