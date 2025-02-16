import { JwtPayload } from '@docu-tide/core/auth';
import {
  ProjectCreateDto,
  ProjectGetDto,
  ProjectUpdateDto,
  ValidationProjectCreateDto,
  ValidationProjectUpdateDto,
} from '@docu-tide/core/dtos';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProjectsService {
  constructor(
    @Inject('PROJECTS_MICROSERVICE')
    private readonly projectsClient: ClientKafka,
  ) {}

  async createProject(
    jwtPayload: JwtPayload,
    validationProjectCreateDto: ValidationProjectCreateDto,
  ): Promise<string> {
    const projectCreateDto: ProjectCreateDto = {
      jwtPayload,
      ...validationProjectCreateDto,
    };

    const result: string = await firstValueFrom(
      this.projectsClient.send(
        process.env['PROJECT_CREATE_TOPIC'],
        JSON.stringify(projectCreateDto),
      ),
    );

    return result;
  }

  async getProject(
    user: JwtPayload,
    projectname: string,
  ): Promise<ProjectGetDto> {
    const payload = {
      ...user,
      projectname,
    };

    const result: ProjectGetDto = await firstValueFrom(
      this.projectsClient.send(
        process.env['PROJECT_GET_TOPIC'],
        JSON.stringify(payload),
      ),
    );

    return result;
  }

  async getAllProjects(user: JwtPayload): Promise<Array<ProjectGetDto>> {
    const result: Array<ProjectGetDto> = await firstValueFrom(
      this.projectsClient.send(
        process.env['PROJECT_GET_ALL_TOPIC'],
        JSON.stringify(user),
      ),
    );

    return result;
  }

  async updateProject(
    jwtPayload: JwtPayload,
    validationProjectUpdateDto: ValidationProjectUpdateDto,
  ): Promise<string> {
    const projectUpdateDto: ProjectUpdateDto = {
      jwtPayload,
      ...validationProjectUpdateDto,
    };

    const result: string = await firstValueFrom(
      this.projectsClient.send(
        process.env['PROJECT_UPDATE_TOPIC'],
        JSON.stringify(projectUpdateDto),
      ),
    );

    return result;
  }

  async deleteProject(user: JwtPayload, projectname: string): Promise<string> {
    const payload = {
      ...user,
      projectname,
    };

    const result: string = await firstValueFrom(
      this.projectsClient.send(
        process.env['PROJECT_DELETE_TOPIC'],
        JSON.stringify(payload),
      ),
    );

    return result;
  }
}
