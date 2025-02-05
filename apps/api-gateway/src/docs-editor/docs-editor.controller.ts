import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { DocsEditorService } from './docs-editor.service';

@Controller()
export class DocsEditorController implements OnModuleInit {
  constructor(
    private readonly docsEditorService: DocsEditorService,
    @Inject('DOCS_EDITOR_MICROSERVICE')
    private readonly docsEditorClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.docsEditorClient.connect();
  }
}
