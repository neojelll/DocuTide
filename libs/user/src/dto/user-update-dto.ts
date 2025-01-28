import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator'

export class UserUpdateDto {
  @IsUUID()
  id?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(15)
  username?: string;

  @IsString()
  @MinLength(7)
  @MaxLength(30)
  password?: string;

  @IsString()
  @MaxLength(500)
  bio?: string;
}
