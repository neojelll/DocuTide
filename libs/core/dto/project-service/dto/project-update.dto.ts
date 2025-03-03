import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { JwtPayload } from '../../../interfaces/jwt/jwt.interface';
import { ValidationProjectUpdateDto } from '../validation-dto/project-update-validation.dto';

export class ProjectUpdateDto extends ValidationProjectUpdateDto {
  @IsObject()
  @IsNotEmpty()
  jwtPayload: JwtPayload;

  @IsString()
  @IsNotEmpty()
  oldProjectName: string;
}
