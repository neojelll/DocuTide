import { IsNotEmpty, IsObject } from 'class-validator';
import { JwtPayload } from '../../../interfaces/jwt/jwt.interface';
import { ValidationUserUpdateDto } from '../validation-dto/user-update-validation.dto';

export class UserUpdateDto extends ValidationUserUpdateDto {
  @IsObject()
  @IsNotEmpty()
  jwtPayload: JwtPayload;
}
