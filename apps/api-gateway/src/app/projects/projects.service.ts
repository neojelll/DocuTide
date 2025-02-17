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
  ): Promise<ProjectGetDto> {
    const projectCreateDto: ProjectCreateDto = {
      jwtPayload,
      ...validationProjectCreateDto,
    };

    return await firstValueFrom(
      this.projectsClient.send(
        process.env['PROJECT_CREATE_TOPIC'],
        JSON.stringify(projectCreateDto),
      ),
    );
  }

  async getAllProjects(jwtPayload: JwtPayload): Promise<Array<ProjectGetDto>> {
    return await firstValueFrom(
      this.projectsClient.send(
        process.env['PROJECT_GET_ALL_TOPIC'],
        JSON.stringify(jwtPayload),
      ),
    );
  }

  async getProject(
    jwtPayload: JwtPayload,
    projectname: string,
  ): Promise<ProjectGetDto> {
    const payload = {
      jwtPayload,
      projectname,
    };

    return await firstValueFrom(
      this.projectsClient.send(
        process.env['PROJECT_GET_TOPIC'],
        JSON.stringify(payload),
      ),
    );
  }

  async updateProject(
    jwtPayload: JwtPayload,
    projectname: string,
    validationProjectUpdateDto: ValidationProjectUpdateDto,
  ): Promise<ProjectGetDto> {
    const projectUpdateDto: ProjectUpdateDto = {
      jwtPayload,
      projectname,
      ...validationProjectUpdateDto,
    };

    return await firstValueFrom(
      this.projectsClient.send(
        process.env['PROJECT_UPDATE_TOPIC'],
        JSON.stringify(projectUpdateDto),
      ),
    );
  }

  async removeProject(
    jwtPayload: JwtPayload,
    projectname: string,
  ): Promise<string> {
    const payload = {
      jwtPayload,
      projectname,
    };

    return await firstValueFrom(
      this.projectsClient.send(
        process.env['PROJECT_DELETE_TOPIC'],
        JSON.stringify(payload),
      ),
    );
  }
}
