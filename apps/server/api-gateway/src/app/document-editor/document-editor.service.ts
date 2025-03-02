import { JwtPayload } from '@docu-tide/auth';
import {
  DocumentCreateDto,
  DocumentGetDto,
  DocumentUpdateDto,
  ValidationDocumentCreateDto,
  ValidationDocumentUpdateDto,
} from '@docu-tide/core';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DocumentEditorService {
  constructor(
    @Inject('DOCS_EDITOR_MICROSERVICE')
    private readonly documentEditorClient: ClientKafka,
  ) {}

  async createDocument(
    jwtPayload: JwtPayload,
    projectId: string,
    validationDocumentCreateDto: ValidationDocumentCreateDto,
  ): Promise<DocumentGetDto> {
    const documentCreateDto: DocumentCreateDto = {
      jwtPayload,
      projectId,
      ...validationDocumentCreateDto,
    };

    return await firstValueFrom(
      this.documentEditorClient.send(
        process.env['DOCUMENT_CREATE_TOPIC'],
        JSON.stringify(documentCreateDto),
      ),
    );
  }

  async getDocument(
    jwtPayload: JwtPayload,
    projectId: string,
  ): Promise<DocumentGetDto> {
    const payload = {
      jwtPayload,
      projectId,
    };

    return await firstValueFrom(
      this.documentEditorClient.send(
        process.env['DOCUMENT_GET_TOPIC'],
        JSON.stringify(payload),
      ),
    );
  }

  async updateDocument(
    jwtPayload: JwtPayload,
    projectId: string,
    validationDocumentUpdateDto: ValidationDocumentUpdateDto,
  ): Promise<DocumentGetDto> {
    const documentUpdateDto: DocumentUpdateDto = {
      jwtPayload,
      projectId,
      ...validationDocumentUpdateDto,
    };

    return await firstValueFrom(
      this.documentEditorClient.send(
        process.env['DOCUMENT_UPDATE_TOPIC'],
        JSON.stringify(documentUpdateDto),
      ),
    );
  }

  async removeDocument(
    jwtPayload: JwtPayload,
    projectId: string,
  ): Promise<string> {
    const payload = {
      jwtPayload,
      projectId,
    };

    return await firstValueFrom(
      this.documentEditorClient.send(
        process.env['DOCUMENT_DELETE_TOPIC'],
        JSON.stringify(payload),
      ),
    );
  }
}
