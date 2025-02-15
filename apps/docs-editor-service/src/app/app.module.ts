import { EnvModule, EnvService } from '@docu-tide/core/env';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  controllers: [AppController],
  providers: [AppService, EnvService],
})
export class AppModule {}
