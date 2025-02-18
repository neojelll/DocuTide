import { JwtPayload } from '@docu-tide/core/auth';
import {
  DocumentCreateDto,
  DocumentGetDto,
  DocumentUpdateDto,
  ValidationDocumentCreateDto,
  ValidationDocumentUpdateDto,
} from '@docu-tide/core/dtos';
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
    projectName: string,
    validationDocumentCreateDto: ValidationDocumentCreateDto,
  ): Promise<DocumentGetDto> {
    const documentCreateDto: DocumentCreateDto = {
      jwtPayload,
      projectName,
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
    projectName: string,
  ): Promise<DocumentGetDto> {
    const payload = {
      jwtPayload,
      projectName,
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
    projectName: string,
    validationDocumentUpdateDto: ValidationDocumentUpdateDto,
  ): Promise<DocumentGetDto> {
    const documentUpdateDto: DocumentUpdateDto = {
      jwtPayload,
      projectName,
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
    projectName: string,
  ): Promise<string> {
    const payload = {
      jwtPayload,
      projectName,
    };

    return await firstValueFrom(
      this.documentEditorClient.send(
        process.env['DOCUMENT_DELETE_TOPIC'],
        JSON.stringify(payload),
      ),
    );
  }
}
