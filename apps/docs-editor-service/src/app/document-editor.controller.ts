import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DocumentEditor } from './document-editor.service';
import { DocumentCreateDto } from '@docu-tide/core/dtos';

@Controller()
export class DocumentEditorController {
  constructor(private readonly documentService: DocumentEditor) {}

  @MessagePattern(process.env['DOCS_NEW_TOPIC'])
  async handleCreateDocument(@Payload() documentData: DocumentCreateDto) {
    return await this.documentService.createDocument(documentData);
  }
}
