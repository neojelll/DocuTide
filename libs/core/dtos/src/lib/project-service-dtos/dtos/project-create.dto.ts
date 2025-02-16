import { JwtPayload } from '@docu-tide/core/auth';
import { IsNotEmpty, IsObject } from 'class-validator';
import { ValidationProjectCreateDto } from '../validation-dtos/project-create-validation.dto';

export class ProjectCreateDto extends ValidationProjectCreateDto {
  @IsObject()
  @IsNotEmpty()
  jwtPayload: JwtPayload;
}
