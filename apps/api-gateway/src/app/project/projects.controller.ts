import { JwtAuthGuard, JwtDecode, JwtPayload } from '@docu-tide/core/auth';
import {
  ValidationProjectCreateDto,
  ValidationProjectUpdateDto,
} from '@docu-tide/core/dtos';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ProjectService } from './projects.service';

@Controller('projects')
export class ProjectController implements OnModuleInit {
  constructor(
    private readonly projectService: ProjectService,
    @Inject('PROJECTS_MICROSERVICE')
    private readonly projectClient: ClientKafka,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProject(
    @JwtDecode() jwtPayload: JwtPayload,
    @Body(ValidationPipe)
    validationProjectCreateDto: ValidationProjectCreateDto,
  ) {
    return await this.projectService.createProject(
      jwtPayload,
      validationProjectCreateDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProjects(@JwtDecode() jwtPayload: JwtPayload) {
    return await this.projectService.getAllProjects(jwtPayload);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':projectname')
  async getProject(
    @JwtDecode() jwtPayload: JwtPayload,
    @Param('projectname') projectname: string,
  ) {
    return await this.projectService.getProject(jwtPayload, projectname);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':projectname')
  async updateProject(
    @JwtDecode() jwtPayload: JwtPayload,
    @Param('projectname') projectname: string,
    @Body(ValidationPipe)
    validationProjectUpdateDto: ValidationProjectUpdateDto,
  ) {
    return await this.projectService.updateProject(
      jwtPayload,
      projectname,
      validationProjectUpdateDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':projectname/remove')
  async removeProject(
    @JwtDecode() jwtPayload: JwtPayload,
    @Param('projectname') projectname: string,
  ) {
    return await this.projectService.removeProject(jwtPayload, projectname);
  }

  async onModuleInit() {
    this.projectClient.subscribeToResponseOf(
      process.env['PROJECT_CREATE_TOPIC'],
    );
    this.projectClient.subscribeToResponseOf(
      process.env['PROJECT_CREATED_TOPIC'],
    );
    this.projectClient.subscribeToResponseOf(process.env['PROJECT_GET_TOPIC']);
    this.projectClient.subscribeToResponseOf(
      process.env['PROJECT_GET_ALL_TOPIC'],
    );
    this.projectClient.subscribeToResponseOf(
      process.env['PROJECT_UPDATE_TOPIC'],
    );
    this.projectClient.subscribeToResponseOf(
      process.env['PROJECT_DELETE_TOPIC'],
    );
    await this.projectClient.connect();
  }
}
