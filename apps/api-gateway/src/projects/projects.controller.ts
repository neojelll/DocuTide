import { ProjectCreateDto, ProjectUpdateDto } from '@lib/project/dto'
import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common'
import { ProjectsService } from './projects.service'

@Controller('users/:userId/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async createProject(@Param('userId') userId: string, @Body(ValidationPipe) projectCreateDto: ProjectCreateDto) {
    return await this.projectsService.createProject(projectCreateDto);
  }

  @Get(':projectId')
  async getProject(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
  ) {
    return await this.projectsService.getProject(userId, projectId);
  }

  @Get()
  async getAllProjects(@Param('userId') userId: string) {
    return await this.projectsService.getAllProjects(userId);
  }

  @Patch(':projectId')
  async updateProject(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
    @Body(ValidationPipe) projectUpdateDto: ProjectUpdateDto,
  ) {
    return await this.projectsService.updateProject(userId, projectId, projectUpdateDto);
  }

  @Delete(':projectId')
  async deleteProject(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
  ) {
    return await this.projectsService.deleteProject(userId, projectId);
  }
}
