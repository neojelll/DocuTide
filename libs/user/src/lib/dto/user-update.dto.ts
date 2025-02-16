import { JwtPayload } from '@docu-tide/core/auth';
import { IsObject } from 'class-validator';
import { ValidationUserUpdateDto } from '../validation-dto/user-update-validation.dto';

export class UserUpdateDto extends ValidationUserUpdateDto {
  @IsObject()
  jwtPayload: JwtPayload;
}
