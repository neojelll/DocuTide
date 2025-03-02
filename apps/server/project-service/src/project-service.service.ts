import {
  ProjectCreateDto,
  ProjectGetDto,
  ProjectUpdateDto,
} from '@docu-tide/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  async createProject(data: ProjectCreateDto): Promise<string> {
    const project = new this.projectModel({
      ...data,
      userId: data.jwtPayload.sub,
    });
    return new ProjectGetDto(await project.save()).stringify();
  }

  async getAllProjects(): Promise<ProjectGetDto[]> {
    const projects = await this.projectModel.find().exec();
    return Promise.all(
      projects.map(async (project) => new ProjectGetDto(project)),
    );
  }

  async getAllUserProjects(userId: string): Promise<ProjectGetDto[]> {
    const projects = await this.projectModel.find({ userId }).exec();
    return Promise.all(
      projects.map(async (project) => new ProjectGetDto(project)),
    );
  }

  async getProjectById(projectId: string): Promise<string> {
    const project = await this.projectModel.findOne({ projectId }).exec();
    if (!project)
      throw new NotFoundException(`Project with id ${projectId} not found.`);
    return new ProjectGetDto(project).stringify();
  }

  async getProjectByProjectname(projectName: string): Promise<string> {
    const project = await this.projectModel.findOne({ projectName }).exec();
    if (!project)
      throw new NotFoundException(`Project ${projectName} not found.`);
    return new ProjectGetDto(project).stringify();
  }

  async updateProject(
    oldProjectName: string,
    data: ProjectUpdateDto,
  ): Promise<string> {
    const updatedProject = await this.projectModel
      .findOneAndUpdate({ projectName: oldProjectName }, data, { new: true })
      .exec();
    if (!updatedProject)
      throw new NotFoundException(`Project ${oldProjectName} not found.`);
    return new ProjectGetDto(updatedProject).stringify();
  }

  async deleteProject(projectName: string): Promise<string> {
    const deletedProject = await this.projectModel
      .findOneAndDelete({ projectName })
      .exec();
    if (!deletedProject)
      throw new NotFoundException(`Project ${projectName} not found.`);
    return `Project ${projectName} deleted successfully.`;
  }
}
