import { EnvModule, EnvService } from '@docu-tide/core/env';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentEditorController } from './document-editor.controller';
import { DocumentEditorService } from './document-editor.service';
import {
  Documentation,
  DocumentationSchema,
} from './schemas/documentation.schema';

@Module({
  imports: [
    EnvModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env['MONGODB_URL'],
      }),
    }),
    MongooseModule.forFeature([
      { name: Documentation.name, schema: DocumentationSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [DocumentEditorController],
  providers: [DocumentEditorService, EnvService],
})
export class DocumentEditorModule {}
