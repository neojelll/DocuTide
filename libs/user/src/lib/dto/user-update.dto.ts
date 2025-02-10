import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UserUpdateDto {
  @IsUUID()
  @ApiPropertyOptional({
    description: 'Unique identifier for the user.',
    type: String,
  })
  userId?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(15)
  @ApiPropertyOptional({
    description:
      'Username of the user, must be between 5 and 15 characters long.',
    type: String,
    minLength: 5,
    maxLength: 15,
    default: '',
  })
  username?: string;

  @IsString()
  @MinLength(7)
  @MaxLength(30)
  @ApiPropertyOptional({
    description:
      'Password of the user, must be between 7 and 30 characters long.',
    type: String,
    minLength: 7,
    maxLength: 30,
    default: '',
  })
  password?: string;

  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({
    description: 'A brief biography of the user.',
    type: String,
    maxLength: 500,
    default: '',
  })
  bio?: string;

  constructor(params: {
    userId?: string;
    username?: string;
    password?: string;
    bio?: string;
  }) {
    this.userId = params.userId;
    this.username = params.username;
    this.password = params.password;
    this.bio = params.bio;
  }
}
