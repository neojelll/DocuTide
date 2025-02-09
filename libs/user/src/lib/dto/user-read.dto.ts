import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
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
  @Expose()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier for the user.',
    type: String,
  })
  userId: string;

  @Expose()
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

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email address of the user.',
    type: String,
  })
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'hash password of the user.',
    type: String,
  })
  hashPassword: string;

  @Expose()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({
    description: 'A brief biography of the user.',
    type: String,
    maxLength: 500,
    default: '',
  })
  bio?: string;

  @Expose()
  @IsString()
  @MaxLength(50)
  @ApiPropertyOptional({
    description: 'Role of the user in the system.',
    type: String,
    maxLength: 50,
    default: '',
  })
  role?: string;

  @Expose()
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Date when the user was created.',
    type: String,
    example: '2025-01-01T00:00:00Z',
  })
  createdAt: Date;

  @Expose()
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Date when the user was last updated.',
    type: String,
    example: '2025-01-01T00:00:00Z',
  })
  updatedAt: Date;

  constructor(
    userId: string,
    username: string,
    email: string,
    hashPassword: string,
    bio: string = '',
    role: string = '',
    createdAt: Date,
    updatedAt: Date
  ) {
    this.userId = userId;
    this.username = username;
    this.email = email;
    this.hashPassword = hashPassword;
    this.bio = bio;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
