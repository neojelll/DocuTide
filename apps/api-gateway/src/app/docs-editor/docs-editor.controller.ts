import { DocsDto } from '@docu-tide/docs/lib/dto';
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
import { JwtDecode } from '../auth/decorators/jwt-decode.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/interfaces/jwt.interface';
import { DocsEditorService } from './docs-editor.service';

@Controller(':username/:projectname')
export class DocsEditorController implements OnModuleInit {
  constructor(
    private readonly docsEditorService: DocsEditorService,
    @Inject('DOCS_EDITOR_MICROSERVICE')
    private readonly docsEditorClient: ClientKafka
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('new')
  async newDocs(
    @JwtDecode() user: JwtPayload,
    @Param('projectname') projectname: string,
    @Body(ValidationPipe) docsDto: DocsDto
  ) {
    return await this.docsEditorService.newDocs(user, projectname, docsDto);
  }

  async onModuleInit() {
    this.docsEditorClient.subscribeToResponseOf(process.env['DOCS_NEW_TOPIC']);
    await this.docsEditorClient.connect();
  }
}
