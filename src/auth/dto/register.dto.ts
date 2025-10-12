import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'baiastan.stalbekov@example.com', 
    description: 'User email address (must be unique)' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: 'SecurePass123!', 
    description: 'User password (minimum 8 characters)' 
  })
  @IsString()
  @IsNotEmpty() 
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ 
    example: 'Baiastan Stalbekov', 
    description: 'User full name' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
