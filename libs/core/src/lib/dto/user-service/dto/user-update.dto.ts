import { JwtPayload } from '@docu-tide/auth';
import { IsNotEmpty, IsObject } from 'class-validator';
import { ValidationUserUpdateDto } from '../validation-dto/user-update-validation.dto';

export class UserUpdateDto extends ValidationUserUpdateDto {
  @IsObject()
  @IsNotEmpty()
  jwtPayload: JwtPayload;
}
