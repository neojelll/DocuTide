import { DocsDto } from '@docu-tide/docs/lib/dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Documentation,
  DocumentationDocument,
} from './schemas/documentation.schema';

@Injectable()
export class DocumentEditorService {
  constructor(
    @InjectModel(Documentation.name)
    private documentationModel: Model<DocumentationDocument>,
  ) {}
  async newDocumentation(message: { projectName: string; docsDto: DocsDto }) {
    const newDocumentation = new this.documentationModel({
      projectName: message.projectName,
      content: message.docsDto.content,
    });

    await newDocumentation.save();

    return 'successful save new documentation';
  }

  async getDocumentation(message: { projectName: string }) {
    const documentation = await this.documentationModel.findOne({
      projectName: message.projectName,
    });

    if (!documentation) {
      throw new NotFoundException(
        `documentation with projectName: ${message.projectName} is not found`,
      );
    }

    return documentation.toObject();
  }
}
