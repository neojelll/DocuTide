import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import {
  ProjectCreateDto,
  ProjectGetDto,
  ProjectUpdateDto,
} from '@docu-tide/core/dtos';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async createProject(projectData: ProjectCreateDto): Promise<string> {
    const newProject = new this.projectModel({
      ...projectData,
      userId: projectData.jwtPayload.sub,
    });
    try {
      return new ProjectGetDto(await newProject.save()).stringify();
    } catch (error) {
      console.error('[Error creating project: ' + error + ']');
      throw error;
    }
  }

  async getAllProjects() {
    const projects = await this.projectModel.find().exec();
    return projects.map((project) => {
      return new ProjectGetDto(project);
    });
  }

  async getProjectById(projectId: string): Promise<string> {
    const project = await this.projectModel.findOne({ projectId: projectId });
    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found.`);
    }
    return new ProjectGetDto(project).stringify();
  }

  async getProjectByProjectname(projectName: string): Promise<string> {
    const project = await this.projectModel.findOne({ projectName });
    if (!project) {
      throw new NotFoundException(
        `Project with projectName ${projectName} not found.`,
      );
    }
    return new ProjectGetDto(project).stringify();
  }

  async updateProject(
    oldProjectName: string,
    data: ProjectUpdateDto,
  ): Promise<string> {
    const updatedProject = await this.projectModel
      .findOneAndUpdate({ projectName: oldProjectName }, data, { new: true })
      .exec();
    if (!updatedProject) {
      throw new NotFoundException(
        `Project with name ${oldProjectName} not found.`,
      );
    }
    return new ProjectGetDto(updatedProject).stringify();
  }

  async deleteProject(projectName: string): Promise<string> {
    const deletedProject = await this.projectModel
      .findOneAndDelete({ projectName })
      .exec();
    if (!deletedProject) {
      throw new NotFoundException(
        `Project with name ${projectName} not found.`,
      );
    }
    return `Project with name ${projectName} deleted successfully.`;
  }
}
