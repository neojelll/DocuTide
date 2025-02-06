import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
