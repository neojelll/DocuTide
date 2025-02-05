import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class DocsEditorService {
  constructor(
    @Inject('DOCS_EDITOR_MICROSERVICE')
    private readonly docsEditorClient: ClientKafka,
  ) {}
}
