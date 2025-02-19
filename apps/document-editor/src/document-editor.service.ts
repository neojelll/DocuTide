import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Documentation,
  DocumentationDocument,
} from './schemas/documentation.schema';
import {
  DocumentCreateDto,
  DocumentGetDto,
  DocumentUpdateDto,
} from '@docu-tide/core/dtos';

@Injectable()
export class DocumentEditor {
  constructor(
    @InjectModel(Documentation.name)
    private readonly documentationModel: Model<DocumentationDocument>,
  ) {}

  async createDocument(data: DocumentCreateDto): Promise<string> {
    const document = new this.documentationModel(data);
    return new DocumentGetDto(await document.save()).stringify();
  }

  async getDocumentByProjectId(projectId: string): Promise<string> {
    const document = await this.documentationModel
      .findOne({ projectId })
      .exec();
    if (!document)
      throw new NotFoundException(
        `Document with projectId "${projectId}" not found.`,
      );
    return new DocumentGetDto(document).stringify();
  }

  async updateDocument(
    projectId: string,
    data: DocumentUpdateDto,
  ): Promise<string> {
    const updatedDocument = await this.documentationModel
      .findOneAndUpdate({ projectId }, data, { new: true })
      .exec();
    if (!updatedDocument)
      throw new NotFoundException(
        `Document with projectId "${projectId}" not found.`,
      );
    return new DocumentGetDto(updatedDocument).stringify();
  }

  async deleteDocument(projectId: string): Promise<string> {
    const deletedDocument = await this.documentationModel
      .findOneAndDelete({ projectId })
      .exec();
    if (!deletedDocument)
      throw new NotFoundException(
        `Document with projectId "${projectId}" not found.`,
      );
    return `Document with projectId "${projectId}" deleted successfully.`;
  }
}
