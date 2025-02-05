import { Module } from '@nestjs/common';
import { DocsEditorController } from './docs-editor.controller';
import { DocsEditorService } from './docs-editor.service';

@Module({
  imports: [],
  controllers: [DocsEditorController],
  providers: [DocsEditorService],
})
export class DocsEditorModule {}
