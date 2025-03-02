import { JwtPayload } from '@docu-tide/auth';
import { DocumentCreateDto, DocumentUpdateDto } from '@docu-tide/core';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DocumentEditor } from './document-editor.service';

@Controller()
export class DocumentEditorController {
  constructor(private readonly documentService: DocumentEditor) {}

  @MessagePattern(process.env.DOCUMENT_CREATE_TOPIC)
  handleCreate(@Payload() payload: DocumentCreateDto) {
    return this.documentService.createDocument(payload);
  }

  @MessagePattern(process.env.DOCUMENT_GET_TOPIC)
  handleGet(
    @Payload()
    { projectId }: { jwtPayload: JwtPayload; projectId: string },
  ) {
    return this.documentService.getDocumentByProjectId(projectId);
  }

  @MessagePattern(process.env.DOCUMENT_UPDATE_TOPIC)
  handleUpdate(@Payload() payload: DocumentUpdateDto) {
    return this.documentService.updateDocument(payload.projectId, payload);
  }

  @MessagePattern(process.env.DOCUMENT_DELETE_TOPIC)
  handleDelete(
    @Payload()
    { projectId }: { jwtPayload: JwtPayload; projectId: string },
  ) {
    return this.documentService.deleteDocument(projectId);
  }
}
