import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IdpLoginDto } from '@app/idp';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('idp/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login via IDP (exchange code, then mint internal JWT)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in (internal JWT returned)',
  })
  async idpLogin(@Body() dto: IdpLoginDto) {
    return this.authService.idpLogin(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('idp/logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Logout (client should delete token)',
    description:
      'This endpoint validates the internal JWT, then returns OK. Client should delete the token.',
  })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  async idpLogout(@CurrentUser() user: any) {
    return {
      message: 'Logout successful. Please delete your access token.',
      user,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        user: {
          id: 1,
          email: 'baiastan.stalbekov@example.com',
          name: 'Baiastan Stalbekov',
        },
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    schema: {
      example: {
        user: {
          id: 1,
          email: 'baiastan.stalbekov@example.com',
          name: 'Baiastan Stalbekov',
        },
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Logout (client should delete token)',
    description:
      'With JWT, logout is handled client-side by removing the token. This endpoint confirms the token is valid before logout.',
  })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid token' })
  async logout(@Request() req) {
    return {
      message: 'Logout successful. Please delete your access token.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get current user profile (requires authentication)',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved',
    schema: {
      example: {
        id: 1,
        email: 'baiastan.stalbekov@example.com',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - no valid token' })
  getProfile(@Request() req) {
    return req.user;
  }
}
