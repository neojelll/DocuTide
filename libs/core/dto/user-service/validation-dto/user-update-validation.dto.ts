import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ValidationUserUpdateDto {
  @ApiPropertyOptional({
    type: String,
    description: 'new user email',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'new user username',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(15)
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'new user password',
  })
  @IsString()
  @MinLength(7)
  @MaxLength(30)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'new user biography',
  })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  biography?: string;
}
