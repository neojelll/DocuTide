import { DocsDto } from '@docu-tide/docs/lib/dto';
import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocsEditorService } from './docs-editor.service';

@Controller('users/:userId/projects/:projectId')
export class DocsEditorController implements OnModuleInit {
  constructor(
    private readonly docsEditorService: DocsEditorService,
    @Inject('DOCS_EDITOR_MICROSERVICE')
    private readonly docsEditorClient: ClientKafka
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('docs')
  async saveDocs(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
    @Body(ValidationPipe) docsDto: DocsDto
  ) {
    return await this.docsEditorService.saveDocs(userId, projectId, docsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('docs')
  async getDocs(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string
  ) {
    return await this.docsEditorService.getDocs(userId, projectId);
  }

  async onModuleInit() {
    this.docsEditorClient.subscribeToResponseOf(
      process.env.DOCS_SAVE_TOPIC || 'docs.save'
    );
    this.docsEditorClient.subscribeToResponseOf(
      process.env.DOCS_GET_TOPIC || 'docs.get'
    );
    await this.docsEditorClient.connect();
  }
}
