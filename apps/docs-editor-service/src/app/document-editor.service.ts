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
    private documentationModel: Model<DocumentationDocument>,
  ) {}

  async createDocument(documentData: DocumentCreateDto): Promise<string> {
    const newDocument = new this.documentationModel({
      ...documentData,
    });
    try {
      return new DocumentGetDto(await newDocument.save()).stringify();
    } catch (error) {
      console.error('[Error creating document: ' + error + ']');
      throw error;
    }
  }

  async getAllDocuments() {
    const documents = await this.documentationModel.find().exec();
    return documents.map((document) => {
      return new DocumentGetDto(document);
    });
  }

  async getDocumentById(documentId: string): Promise<string> {
    const document = await this.documentationModel.findOne({
      documentId: documentId,
    });
    if (!document) {
      throw new NotFoundException(`Document with id ${documentId} not found.`);
    }
    return new DocumentGetDto(document).stringify();
  }

  async updateDocument(
    documentId: string,
    data: DocumentUpdateDto,
  ): Promise<string> {
    const updatedDocument = await this.documentationModel
      .findOneAndUpdate({ documentId }, data, { new: true })
      .exec();
    if (!updatedDocument) {
      throw new NotFoundException(`Document with id ${documentId} not found.`);
    }
    return new DocumentGetDto(updatedDocument).stringify();
  }

  async deleteDocument(documentId: string): Promise<string> {
    const deletedDocument = await this.documentationModel
      .findOneAndDelete({ documentId })
      .exec();
    if (!deletedDocument) {
      throw new NotFoundException(`Document with id ${documentId} not found.`);
    }
    return new DocumentGetDto(deletedDocument).stringify();
  }
}
