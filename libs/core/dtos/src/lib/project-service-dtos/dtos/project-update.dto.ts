import { JwtPayload } from '@docu-tide/core/auth';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ValidationProjectUpdateDto } from '../validation-dtos/project-update-validation.dto';

export class ProjectUpdateDto extends ValidationProjectUpdateDto {
  @IsObject()
  @IsNotEmpty()
  jwtPayload: JwtPayload;

  @IsString()
  @IsNotEmpty()
  projectname: string;
}
