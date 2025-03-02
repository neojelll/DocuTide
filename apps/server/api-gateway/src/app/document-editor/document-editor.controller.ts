import {
  ValidationDocumentCreateDto,
  ValidationDocumentUpdateDto,
} from '@docu-tide/core';
import { JwtAuthGuard, JwtDecode, JwtPayload } from '@docu-tide/server/auth';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { DocumentEditorService } from './document-editor.service';

@Controller('documents/:projectId')
export class DocumentEditorController implements OnModuleInit {
  constructor(
    private readonly documentEditorService: DocumentEditorService,
    @Inject('DOCS_EDITOR_MICROSERVICE')
    private readonly documentEditorClient: ClientKafka,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createDocument(
    @JwtDecode() jwtPayload: JwtPayload,
    @Param('projectId') projectId: string,
    @Body(ValidationPipe)
    validationDocumentCreateDto: ValidationDocumentCreateDto,
  ) {
    return await this.documentEditorService.createDocument(
      jwtPayload,
      projectId,
      validationDocumentCreateDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getDocument(
    @JwtDecode() jwtPayload: JwtPayload,
    @Param('projectId') projectId: string,
  ) {
    return await this.documentEditorService.getDocument(jwtPayload, projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateDocument(
    @JwtDecode() jwtPayload: JwtPayload,
    @Param('projectId') projectId: string,
    @Body(ValidationPipe)
    validationDocumentUpdateDto: ValidationDocumentUpdateDto,
  ) {
    return await this.documentEditorService.updateDocument(
      jwtPayload,
      projectId,
      validationDocumentUpdateDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async removeDocument(
    @JwtDecode() jwtPayload: JwtPayload,
    @Param('projectId') projectId: string,
  ) {
    return await this.documentEditorService.removeDocument(
      jwtPayload,
      projectId,
    );
  }

  async onModuleInit() {
    this.documentEditorClient.subscribeToResponseOf(
      process.env['DOCUMENT_CREATE_TOPIC'],
    );
    this.documentEditorClient.subscribeToResponseOf(
      process.env['DOCUMENT_GET_TOPIC'],
    );
    this.documentEditorClient.subscribeToResponseOf(
      process.env['DOCUMENT_UPDATE_TOPIC'],
    );
    this.documentEditorClient.subscribeToResponseOf(
      process.env['DOCUMENT_DELETE_TOPIC'],
    );
    await this.documentEditorClient.connect();
  }
}
