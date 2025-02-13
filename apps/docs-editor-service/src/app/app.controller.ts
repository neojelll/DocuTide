import { JwtPayload } from '@docu-tide/core/auth';
import { DocsDto } from '@docu-tide/docs/lib/dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(process.env['DOCS_NEW_TOPIC'])
  async newDocs(
    @Payload()
    message: {
      user: JwtPayload;
      projectname: string;
      docsDto: DocsDto;
    },
  ) {
    return this.appService.newDocs(message);
  }
}
