import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';
import { ValidationProjectCreateDto } from '../validation-dtos/project-create-validation.dto';

export class ProjectGetDto extends ValidationProjectCreateDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
