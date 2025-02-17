import { JwtAuthGuard, JwtDecode, JwtPayload } from '@docu-tide/core/auth';
import {
  ValidationDocumentCreateDto,
  ValidationDocumentUpdateDto,
} from '@docu-tide/core/dtos';
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
import { DocsEditorService } from './docs-editor.service';

@Controller('projects/:projectname/document')
export class DocsEditorController implements OnModuleInit {
  constructor(
    private readonly docsEditorService: DocsEditorService,
    @Inject('DOCS_EDITOR_MICROSERVICE')
    private readonly docsEditorClient: ClientKafka,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createDocument(
    @JwtDecode() jwtPayload: JwtPayload,
    @Param('projectname') projectname: string,
    @Body(ValidationPipe)
    validationDocumentCreateDto: ValidationDocumentCreateDto,
  ) {
    return await this.docsEditorService.createDocument(
      jwtPayload,
      projectname,
      validationDocumentCreateDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getDocument(
    @JwtDecode() jwtPayload: JwtPayload,
    @Param('projectname') projectname: string,
  ) {
    return await this.docsEditorService.getDocument(jwtPayload, projectname);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateDocument(
    @JwtDecode() jwtPayload: JwtPayload,
    @Param('projectname') projectname: string,
    @Body(ValidationPipe)
    validationDocumentUpdateDto: ValidationDocumentUpdateDto,
  ) {
    return await this.docsEditorService.updateDocument(
      jwtPayload,
      projectname,
      validationDocumentUpdateDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove')
  async removeDocument(
    @JwtDecode() jwtPayload: JwtPayload,
    @Param('projectname') projectname: string,
  ) {
    return await this.docsEditorService.removeDocument(jwtPayload, projectname);
  }

  async onModuleInit() {
    this.docsEditorClient.subscribeToResponseOf(
      process.env['DOCUMENT_CREATE_TOPIC'],
    );
    this.docsEditorClient.subscribeToResponseOf(
      process.env['DOCUMENT_GET_TOPIC'],
    );
    this.docsEditorClient.subscribeToResponseOf(
      process.env['DOCUMENT_UPDATE_TOPIC'],
    );
    this.docsEditorClient.subscribeToResponseOf(
      process.env['DOCUMENT_DELETE_TOPIC'],
    );
    await this.docsEditorClient.connect();
  }
}
