import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserReadDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier for the user.',
    type: String,
  })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(15)
  @ApiProperty({
    description:
      'Username of the user, must be between 5 and 15 characters long.',
    type: String,
    minLength: 5,
    maxLength: 15,
  })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email address of the user.',
    type: String,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'hash password of the user.',
    type: String,
  })
  hashPassword: string;

  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({
    description: 'A brief biography of the user.',
    type: String,
    maxLength: 500,
    default: '',
  })
  bio?: string;

  @IsString()
  @MaxLength(50)
  @ApiPropertyOptional({
    description: 'Role of the user in the system.',
    type: String,
    maxLength: 50,
    default: '',
  })
  role?: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Date when the user was created.',
    type: String,
    example: '2025-01-01T00:00:00Z',
  })
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Date when the user was last updated.',
    type: String,
    example: '2025-01-01T00:00:00Z',
  })
  updatedAt: Date;
}
