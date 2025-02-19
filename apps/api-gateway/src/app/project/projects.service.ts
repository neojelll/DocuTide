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
export class ProjectService {
  constructor(
    @Inject('PROJECTS_MICROSERVICE')
    private readonly projectClient: ClientKafka,
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
      this.projectClient.send(
        process.env['PROJECT_CREATE_TOPIC'],
        JSON.stringify(projectCreateDto),
      ),
    );
  }

  async getAllProjects(jwtPayload: JwtPayload): Promise<string[]> {
    return await firstValueFrom(
      this.projectClient.send(
        process.env['PROJECT_GET_ALL_TOPIC'],
        JSON.stringify(jwtPayload),
      ),
    );
  }

  async getAllProjectsByUserId(jwtPayload: JwtPayload): Promise<string[]> {
    return await firstValueFrom(
      this.projectClient.send(
        process.env['PROJECT_GET_ALL_BY_USER_ID_TOPIC'],
        JSON.stringify(jwtPayload),
      ),
    );
  }

  async getProject(
    jwtPayload: JwtPayload,
    projectName: string,
  ): Promise<ProjectGetDto> {
    const payload = {
      jwtPayload,
      projectName,
    };

    return await firstValueFrom(
      this.projectClient.send(
        process.env['PROJECT_GET_TOPIC'],
        JSON.stringify(payload),
      ),
    );
  }

  async updateProject(
    jwtPayload: JwtPayload,
    projectName: string,
    validationProjectUpdateDto: ValidationProjectUpdateDto,
  ): Promise<ProjectGetDto> {
    const projectUpdateDto: ProjectUpdateDto = {
      jwtPayload,
      oldProjectName: projectName,
      ...validationProjectUpdateDto,
    };

    return await firstValueFrom(
      this.projectClient.send(
        process.env['PROJECT_UPDATE_TOPIC'],
        JSON.stringify(projectUpdateDto),
      ),
    );
  }

  async removeProject(
    jwtPayload: JwtPayload,
    projectName: string,
  ): Promise<string> {
    const payload = {
      jwtPayload,
      projectName,
    };

    return await firstValueFrom(
      this.projectClient.send(
        process.env['PROJECT_DELETE_TOPIC'],
        JSON.stringify(payload),
      ),
    );
  }
}
