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
export class DocsEditorService {
  constructor(
    @Inject('DOCS_EDITOR_MICROSERVICE')
    private readonly docsEditorClient: ClientKafka,
  ) {}

  async createDocument(
    jwtPayload: JwtPayload,
    projectname: string,
    validationDocumentCreateDto: ValidationDocumentCreateDto,
  ): Promise<DocumentGetDto> {
    const documentCreateDto: DocumentCreateDto = {
      jwtPayload,
      projectname,
      ...validationDocumentCreateDto,
    };

    return await firstValueFrom(
      this.docsEditorClient.send(
        process.env['DOCUMENT_CREATE_TOPIC'],
        JSON.stringify(documentCreateDto),
      ),
    );
  }

  async getDocument(
    jwtPayload: JwtPayload,
    projectname: string,
  ): Promise<DocumentGetDto> {
    const payload = {
      jwtPayload,
      projectname,
    };

    return await firstValueFrom(
      this.docsEditorClient.send(
        process.env['DOCUMENT_GET_TOPIC'],
        JSON.stringify(payload),
      ),
    );
  }

  async updateDocument(
    jwtPayload: JwtPayload,
    projectname: string,
    validationDocumentUpdateDto: ValidationDocumentUpdateDto,
  ): Promise<DocumentGetDto> {
    const documentUpdateDto: DocumentUpdateDto = {
      jwtPayload,
      projectname,
      ...validationDocumentUpdateDto,
    };

    return await firstValueFrom(
      this.docsEditorClient.send(
        process.env['DOCUMENT_UPDATE_TOPIC'],
        JSON.stringify(documentUpdateDto),
      ),
    );
  }

  async removeDocument(
    jwtPayload: JwtPayload,
    projectname: string,
  ): Promise<string> {
    const payload = {
      jwtPayload,
      projectname,
    };

    return await firstValueFrom(
      this.docsEditorClient.send(
        process.env['DOCUMENT_DELETE_TOPIC'],
        JSON.stringify(payload),
      ),
    );
  }
}
