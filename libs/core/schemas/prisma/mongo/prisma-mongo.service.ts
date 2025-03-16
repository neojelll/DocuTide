import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient as MongoPrismaClient } from '@prisma/mongo/client';

@Injectable()
export class PrismaMongoService
  extends MongoPrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    let retries = 5;

    while (retries > 0) {
      try {
        await this.$connect();

        console.log('Successfully connected to mongo database');

        break;
      } catch (err) {
        console.error(err);

        console.error(
          `there was an error connecting to database, retrying .... (${retries})`,
        );

        retries -= 1;

        await new Promise((res) => setTimeout(res, 3_000));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
