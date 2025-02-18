import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DocumentEditorController } from './document-editor.controller';
import { DocumentEditorService } from './document-editor.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DOCS_EDITOR_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'docs-editor',
            brokers: [process.env['MESSAGE_BROKER_URL']],
          },
          consumer: {
            groupId: 'docs-editor-consumer',
          },
        },
      },
    ]),
  ],
  providers: [DocumentEditorService],
  controllers: [DocumentEditorController],
})
export class DocumentEditorModule {}
