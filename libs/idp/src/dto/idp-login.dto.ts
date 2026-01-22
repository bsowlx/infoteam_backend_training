import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class IdpLoginDto {
  @ApiProperty({
    description: 'Authorization code issued by the IDP',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'PKCE code_verifier',
  })
  @IsString()
  @IsNotEmpty()
  codeVerifier: string;

  @ApiPropertyOptional({
    description: 'Optional redirect_uri',
  })
  @IsString()
  @IsOptional()
  redirectUri?: string;
}
