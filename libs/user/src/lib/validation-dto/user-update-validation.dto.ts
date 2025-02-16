import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class ValidationUserUpdateDto {
  @ValidateIf((o) => o.username !== undefined)
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

  @ValidateIf((o) => o.password !== undefined)
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

  @ValidateIf((o) => o.bio !== undefined)
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({
    description: 'A brief biography of the user.',
    type: String,
    maxLength: 500,
    default: '',
  })
  bio?: string;
}
