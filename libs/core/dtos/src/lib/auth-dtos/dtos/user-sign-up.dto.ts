import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { UserSignInDto } from './user-sign-in.dto';

export class UserSignUpDto extends UserSignInDto {
  @ApiProperty({
    type: String,
    description: 'email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    type: Boolean,
    default: false,
    description: 'agreement to receive notifications',
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? false : value))
  receiveNotifications: boolean;
}
