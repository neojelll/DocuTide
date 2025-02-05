import { Controller, Get } from '@nestjs/common';
import { DocsEditorService } from './docs-editor.service';

@Controller()
export class DocsEditorController {
  constructor(private readonly docsEditorService: DocsEditorService) {}

  @Get()
  getHello(): string {
    return this.docsEditorService.getHello();
  }
}
