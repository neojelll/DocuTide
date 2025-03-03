import { IsNotEmpty, IsObject } from 'class-validator';
import { JwtPayload } from '../../../interfaces/jwt/jwt.interface';
import { ValidationProjectCreateDto } from '../validation-dto/project-create-validation.dto';

export class ProjectCreateDto extends ValidationProjectCreateDto {
  @IsObject()
  @IsNotEmpty()
  jwtPayload: JwtPayload;
}
