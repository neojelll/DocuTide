import { JwtAuthGuard, JwtDecode, JwtPayload } from '@docu-tide/core/auth';
import { ValidationDocumentCreateDto } from '@docu-tide/core/dtos';
import {
  Body,
  Controller,
  Inject,
  OnModuleInit,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { DocsEditorService } from './docs-editor.service';

@Controller(':username/:projectname')
export class DocsEditorController implements OnModuleInit {
  constructor(
    private readonly docsEditorService: DocsEditorService,
    @Inject('DOCS_EDITOR_MICROSERVICE')
    private readonly docsEditorClient: ClientKafka,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('new')
  async newDocs(
    @JwtDecode() jwtPayload: JwtPayload,
    @Param('projectname') projectname: string,
    @Body(ValidationPipe)
    validationDocumentCreateDto: ValidationDocumentCreateDto,
  ) {
    return await this.docsEditorService.newDocs(
      jwtPayload,
      projectname,
      validationDocumentCreateDto,
    );
  }

  async onModuleInit() {
    this.docsEditorClient.subscribeToResponseOf(process.env['DOCS_NEW_TOPIC']);
    await this.docsEditorClient.connect();
  }
}
