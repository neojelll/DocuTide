import { JwtPayload } from '@docu-tide/auth';
import { IsNotEmpty, IsObject } from 'class-validator';
import { ValidationProjectCreateDto } from '../validation-dto/project-create-validation.dto';

export class ProjectCreateDto extends ValidationProjectCreateDto {
  @IsObject()
  @IsNotEmpty()
  jwtPayload: JwtPayload;
}
