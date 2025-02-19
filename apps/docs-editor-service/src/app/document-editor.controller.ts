import { JwtPayload } from '@docu-tide/core/auth';
import { DocsDto } from '@docu-tide/docs/lib/dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DocumentEditorService } from './document-editor.service';

@Controller()
export class DocumentEditorController {
  constructor(private readonly appService: DocumentEditorService) {}

  @MessagePattern(process.env['DOCS_NEW_TOPIC'])
  async newDocs(
    @Payload()
    message: {
      user: JwtPayload;
      projectName: string;
      docsDto: DocsDto;
    },
  ) {
    return this.appService.newDocumentation(message);
  }
}
