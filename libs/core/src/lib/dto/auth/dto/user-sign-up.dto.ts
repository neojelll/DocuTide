import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserSignInDto } from './user-sign-in.dto';

export class UserSignUpDto extends UserSignInDto {
  @ApiProperty({
    type: String,
    description: 'email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
