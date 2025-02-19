import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProjectService } from './project-service.service';
import { ProjectCreateDto, ProjectUpdateDto } from '@docu-tide/core/dtos';
import { JwtPayload } from '@docu-tide/core/auth';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @MessagePattern(process.env.PROJECT_CREATE_TOPIC)
  handleCreate(@Payload() projectData: ProjectCreateDto) {
    return this.projectService.createProject(projectData);
  }

  @MessagePattern(process.env.PROJECT_GET_ALL_TOPIC)
  handleGetAll() {
    return this.projectService.getAllProjects();
  }

  @MessagePattern(process.env.PROJECT_GET_ALL_BY_USER_ID_TOPIC)
  handleGetAllByUserId(jwtPayload: JwtPayload) {
    return this.projectService.getAllProjectsByUserId(jwtPayload.sub);
  }

  @MessagePattern(process.env.PROJECT_GET_TOPIC)
  handleGet(
    @Payload()
    {
      jwtPayload,
      projectName,
    }: {
      jwtPayload: JwtPayload;
      projectName: string;
    },
  ) {
    return this.projectService.getProjectByProjectname(projectName);
  }

  @MessagePattern(process.env.PROJECT_UPDATE_TOPIC)
  handleUpdate(@Payload() payload: ProjectUpdateDto) {
    return this.projectService.updateProject(payload.oldProjectName, payload);
  }

  @MessagePattern(process.env.PROJECT_DELETE_TOPIC)
  handleDelete(
    @Payload()
    {
      jwtPayload,
      projectName,
    }: {
      jwtPayload: JwtPayload;
      projectName: string;
    },
  ) {
    return this.projectService.deleteProject(projectName);
  }
}
