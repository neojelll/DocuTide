import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DocsEditorService {
  constructor(
    @Inject('DOCS_EDITOR_MICROSERVICE')
    private readonly docsEditorClient: ClientKafka,
  ) {}

  // add DTO annotation
  async saveDocs(userId: string, projectId: string, docsDto) {
    const payload = {
      userId,
      projectId,
      ...docsDto,
    };
    const result = await firstValueFrom(
      this.docsEditorClient.send(
        process.env.DOCS_SAVE_TOPIC,
        JSON.stringify(payload),
      ),
    );

    return result;
  }

  async getDocs(userId: string, projectId: string) {
    const payload = {
      userId,
      projectId,
    };

    const result = await firstValueFrom(
      this.docsEditorClient.send(
        process.env.DOCS_GET_TOPIC,
        JSON.stringify(payload),
      ),
    );

    return result;
  }
}
