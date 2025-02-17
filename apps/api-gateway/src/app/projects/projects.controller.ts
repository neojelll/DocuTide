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
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController implements OnModuleInit {
  constructor(
    private readonly projectsService: ProjectsService,
    @Inject('PROJECTS_MICROSERVICE')
    private readonly projectsClient: ClientKafka,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProject(
    @JwtDecode() jwtPayload: JwtPayload,
    @Body(ValidationPipe)
    validationProjectCreateDto: ValidationProjectCreateDto,
  ) {
    return await this.projectsService.createProject(
      jwtPayload,
      validationProjectCreateDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProjects(@JwtDecode() jwtPayload: JwtPayload) {
    return await this.projectsService.getAllProjects(jwtPayload);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':projectname')
  async getProject(
    @JwtDecode() jwtPayload: JwtPayload,
    @Param('projectname') projectname: string,
  ) {
    return await this.projectsService.getProject(jwtPayload, projectname);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':projectname')
  async updateProject(
    @JwtDecode() jwtPayload: JwtPayload,
    @Param('projectname') projectname: string,
    @Body(ValidationPipe)
    validationProjectUpdateDto: ValidationProjectUpdateDto,
  ) {
    return await this.projectsService.updateProject(
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
    return await this.projectsService.removeProject(jwtPayload, projectname);
  }

  async onModuleInit() {
    this.projectsClient.subscribeToResponseOf(
      process.env['PROJECT_CREATE_TOPIC'],
    );
    this.projectsClient.subscribeToResponseOf(
      process.env['PROJECT_CREATED_TOPIC'],
    );
    this.projectsClient.subscribeToResponseOf(process.env['PROJECT_GET_TOPIC']);
    this.projectsClient.subscribeToResponseOf(
      process.env['PROJECT_GET_ALL_TOPIC'],
    );
    this.projectsClient.subscribeToResponseOf(
      process.env['PROJECT_UPDATE_TOPIC'],
    );
    this.projectsClient.subscribeToResponseOf(
      process.env['PROJECT_DELETE_TOPIC'],
    );
    await this.projectsClient.connect();
  }
}
