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
      const savedProject = await newProject.save();
      console.log('New project created:', savedProject);
      return new ProjectGetDto(savedProject).stringify();
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }


  async getAllProjects() {
    console.log('Fetching all projects...');
    const projects = await this.projectModel.find().exec();
    console.log('Projects fetched:', projects);

    const result = projects.map((project) => {
      return new ProjectGetDto(project);
    });

    console.log('Fetched all projects:', result);
    return result;
  }



  async getProjectById(projectId: string): Promise<string> {
    console.log(`Fetching project by ID: ${projectId}`);
    const project = await this.projectModel.findOne({ id: projectId });
    if (!project) {
      console.log(`Project with ID ${projectId} not found.`);
      throw new NotFoundException(`Project with id ${projectId} not found.`);
    }
    console.log('Project found:', project);
    return new ProjectGetDto(project).stringify();
  }

  async getProjectByProjectname(projectName: string): Promise<string> {
    console.log(`Fetching project by projectName: ${projectName}`);
    const project = await this.projectModel.findOne({ projectName });
    if (!project) {
      console.log(`Project with projectName ${projectName} not found.`);
      throw new NotFoundException(`Project with projectName ${projectName} not found.`);
    }
    console.log('Project found:', project);
    return new ProjectGetDto(project).stringify();
  }

  async updateProject(oldProjectName: string, data: ProjectUpdateDto): Promise<string> {
    console.log(`Updating project with projectName: ${oldProjectName} with data:`, data);
    const updatedProject = await this.projectModel
      .findOneAndUpdate({ projectName : oldProjectName }, data, { new: true })
      .exec();
    if (!updatedProject) {
      console.log(`Project with name ${oldProjectName} not found for update.`);
      throw new NotFoundException(`Project with name ${oldProjectName} not found.`);
    }
    console.log('Updated project:', updatedProject);
    return new ProjectGetDto(updatedProject).stringify();
  }

  async deleteProject(projectName: string): Promise<string> {
    console.log(`Deleting project with ID: ${projectName}`);
    const deletedProject = await this.projectModel
      .findOneAndDelete({ projectName })
      .exec();
    if (!deletedProject) {
      console.log(`Project with name ${projectName} not found for deletion.`);
      throw new NotFoundException(`Project with name ${projectName} not found.`);
    }
    console.log(`Project with name ${projectName} deleted successfully.`);
    return `Project with name ${projectName} deleted successfully.`;
  }
}
