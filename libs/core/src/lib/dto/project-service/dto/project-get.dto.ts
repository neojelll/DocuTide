import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';
import { ProjectGetPayload } from '../../../interfaces/dto/project-get.interface';
import { ValidationProjectCreateDto } from '../validation-dto/project-create-validation.dto';

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

  constructor(projectGetPayload: ProjectGetPayload) {
    super();
    this.userId = projectGetPayload.userId;
    this.projectId = projectGetPayload.projectId;
    this.projectName = projectGetPayload.projectName;
    this.description = projectGetPayload.description;
    this.createdAt = projectGetPayload.createdAt;
    this.updatedAt = projectGetPayload.updatedAt;
  }

  async stringify(): Promise<string> {
    return JSON.stringify(this, null, 2);
  }
}
