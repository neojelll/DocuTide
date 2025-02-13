import { JwtPayload } from '@docu-tide/core/auth';
import { DocsDto } from '@docu-tide/docs/lib/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DocsEditorService {
  constructor(
    @Inject('DOCS_EDITOR_MICROSERVICE')
    private readonly docsEditorClient: ClientKafka
  ) {}

  async newDocs(user: JwtPayload, projectname: string, docsDto: DocsDto) {
    const payload = {
      ...user,
      projectname,
      ...docsDto,
    };

    const result = await firstValueFrom(
      this.docsEditorClient.send(
        process.env['DOCS_NEW_TOPIC'],
        JSON.stringify(payload)
      )
    );

    return result;
  }
}
