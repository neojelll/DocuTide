import { Module } from '@nestjs/common';
import { PrismaMongoService } from './mongo/prisma-mongo.service';
import { PrismaPostgresService } from './postgres/prisma-postgres.service';

@Module({
  providers: [PrismaPostgresService, PrismaMongoService],
  exports: [PrismaPostgresService, PrismaMongoService],
})
export class SchemasModule {}
