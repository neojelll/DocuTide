import { JwtPayload } from '@docu-tide/core/auth';
import {
  DocumentCreateDto,
  ValidationDocumentCreateDto,
} from '@docu-tide/core/dtos';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DocsEditorService {
  constructor(
    @Inject('DOCS_EDITOR_MICROSERVICE')
    private readonly docsEditorClient: ClientKafka,
  ) {}

  async newDocs(
    jwtPayload: JwtPayload,
    projectname: string,
    validationDocumentCreateDto: ValidationDocumentCreateDto,
  ) {
    const documentCreateDto: DocumentCreateDto = {
      jwtPayload,
      projectname,
      ...validationDocumentCreateDto,
    };

    const result = await firstValueFrom(
      this.docsEditorClient.send(
        process.env['DOCS_NEW_TOPIC'],
        JSON.stringify(documentCreateDto),
      ),
    );

    return result;
  }
}
