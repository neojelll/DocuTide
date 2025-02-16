import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserSignInDto {
  @ApiProperty({
    type: String,
    description:
      'username of the user, must be  between 5 and 15 characters long',
    minLength: 5,
    maxLength: 15,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(15)
  username: string;

  @ApiProperty({
    type: String,
    description:
      'Password of the user, must be between 7 and 30 characters long',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(30)
  password: string;
}
