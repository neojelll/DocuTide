import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserSignInDto {
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

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(30)
  @ApiProperty({
    description:
      'Password of the user, must be between 7 and 30 characters long.',
    type: String,
    minLength: 7,
    maxLength: 30,
  })
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}
