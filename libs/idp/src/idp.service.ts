import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { IdpLoginDto } from './dto/idp-login.dto';
import { IdpTokenResponseDto } from './dto/idp-token-response.dto';
import { IdpUserInfoResponseDto } from './dto/idp-userinfo-response.dto';

@Injectable()
export class IdpService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private get baseUrl(): string {
    return (
      this.configService.get<string>('IDP_BASE_URL') ??
      'https://api.idp.gistory.me'
    );
  }

  private get clientId(): string {
    return this.configService.get<string>('IDP_CLIENT_ID')!;
  }

  private get clientSecret(): string {
    return this.configService.get<string>('IDP_CLIENT_SECRET')!;
  }

  private buildBasicAuthHeader(): string {
    const token = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
      'utf8',
    ).toString('base64');
    return `Basic ${token}`;
  }

  async exchangeAuthorizationCode(params: {
    code: string;
    codeVerifier: string;
    redirectUri?: string;
  }): Promise<IdpTokenResponseDto> {
    const url = `${this.baseUrl}/oauth/token`;

    const form = new URLSearchParams();
    form.set('code', params.code);
    form.set('grant_type', 'authorization_code');
    form.set('code_verifier', params.codeVerifier);
    if (params.redirectUri) {
      form.set('redirect_uri', params.redirectUri);
    }

    const { data } = await firstValueFrom(
      this.httpService.post<IdpTokenResponseDto>(url, form.toString(), {
        headers: {
          Authorization: this.buildBasicAuthHeader(),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );

    return data;
  }

  async getUserInfo(accessToken: string): Promise<IdpUserInfoResponseDto> {
    const url = `${this.baseUrl}/oauth/userinfo`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<IdpUserInfoResponseDto>(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      return data;
    } catch {
      throw new UnauthorizedException('Invalid IDP access token');
    }
  }

  async validateAccessToken(
    accessToken: string,
  ): Promise<IdpUserInfoResponseDto> {
    return this.getUserInfo(accessToken);
  }

  async exchangeAuthorizationCodeFromDto(
    dto: IdpLoginDto,
  ): Promise<IdpTokenResponseDto> {
    return this.exchangeAuthorizationCode({
      code: dto.code,
      codeVerifier: dto.codeVerifier,
      redirectUri: dto.redirectUri,
    });
  }
}
