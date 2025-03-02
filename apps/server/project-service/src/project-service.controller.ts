import { ProjectCreateDto, ProjectUpdateDto } from '@docu-tide/core';
import { JwtPayload } from '@docu-tide/server/auth';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProjectService } from './project-service.service';

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

  @MessagePattern(process.env.PROJECT_GET_ALL_BY_USER_TOPIC)
  handleGetAllUserProjects(jwtPayload: JwtPayload) {
    return this.projectService.getAllUserProjects(jwtPayload.sub);
  }

  @MessagePattern(process.env.PROJECT_GET_TOPIC)
  handleGet(
    @Payload()
    { projectName }: { jwtPayload: JwtPayload; projectName: string },
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
    { projectName }: { jwtPayload: JwtPayload; projectName: string },
  ) {
    return this.projectService.deleteProject(projectName);
  }
}
