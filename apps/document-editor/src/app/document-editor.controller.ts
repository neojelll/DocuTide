import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DocumentEditor } from './document-editor.service';
import { DocumentCreateDto, DocumentUpdateDto } from '@docu-tide/core/dtos';
import { JwtPayload } from '@docu-tide/core/auth';

@Controller()
export class DocumentEditorController {
  constructor(private readonly documentService: DocumentEditor) {}

  @MessagePattern(process.env['DOCUMENT_CREATE_TOPIC'])
  async handleCreateDocument(@Payload() documentData: DocumentCreateDto) {
    return await this.documentService.createDocument(documentData);
  }

  @MessagePattern(process.env['DOCUMENT_GET_TOPIC'])
  async handleGetDocument(
    @Payload() data: { jwtPayload: JwtPayload; projectId: string },
  ) {
    return await this.documentService.getDocumentByProjectId(data.projectId);
  }

  @MessagePattern(process.env['DOCUMENT_UPDATE_TOPIC'])
  async handleUpdateDocument(@Payload() payload: DocumentUpdateDto) {
    const { ...documentData } = payload;
    return await this.documentService.updateDocument(
      payload.projectId,
      documentData,
    );
  }

  @MessagePattern(process.env['DOCUMENT_DELETE_TOPIC'])
  async handleDeleteDocument(
    @Payload() data: { jwtPayload: JwtPayload; projectName: string },
  ) {
    return await this.documentService.deleteDocument(data.projectName);
  }
}
