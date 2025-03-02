import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentEditorController } from './document-editor.controller';
import { DocumentEditor } from './document-editor.service';
import {
  Documentation,
  DocumentationSchema,
} from './schemas/documentation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://admin:secret@localhost:27017',
    ),
    MongooseModule.forFeature([
      { name: Documentation.name, schema: DocumentationSchema },
    ]),
    ClientsModule.register([
      {
        name: 'DOCUMENT_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'document-editor',
            brokers: [process.env.MESSAGE_BROKER_URL || 'localhost:9094'],
          },
          consumer: {
            groupId: 'document-editor-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [DocumentEditorController],
  providers: [DocumentEditor],
})
export class DocumentEditorModule {}
