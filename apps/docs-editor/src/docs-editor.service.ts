import { Injectable } from '@nestjs/common';

@Injectable()
export class DocsEditorService {
  getHello(): string {
    return 'Hello World!';
  }
}
