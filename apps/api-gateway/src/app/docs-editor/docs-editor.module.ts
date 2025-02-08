import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DocsEditorController } from './docs-editor.controller';
import { DocsEditorService } from './docs-editor.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DOCS_EDITOR_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'docs-editor',
            brokers: [process.env.MESSAGE_BROKER_URL || 'localhost:9094'],
          },
          consumer: {
            groupId: 'docs-editor-consumer',
          },
        },
      },
    ]),
  ],
  providers: [DocsEditorService],
  controllers: [DocsEditorController],
})
export class DocsEditorModule {}
