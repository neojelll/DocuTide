import { JwtPayload } from '@docu-tide/core/auth';
import { IsNotEmpty, IsObject } from 'class-validator';
import { ValidationUserUpdateDto } from '../validation-dtos/user-update-validation.dto';

export class UserUpdateDto extends ValidationUserUpdateDto {
  @IsObject()
  @IsNotEmpty()
  jwtPayload: JwtPayload;
}
