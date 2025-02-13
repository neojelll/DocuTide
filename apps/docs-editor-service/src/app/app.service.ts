import { JwtPayload } from '@docu-tide/core/auth';
import { DocsDto } from '@docu-tide/docs/lib/dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async newDocs(message: {
    user: JwtPayload;
    projectname: string;
    docsDto: DocsDto;
  }) {
    // logics...
  }
}
