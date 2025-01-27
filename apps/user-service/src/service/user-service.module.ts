import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { UserServiceController } from '../controller/user-service.controller';
import { UserServiceService } from './user-service.service';
import { UserPostgres } from '../entities/user-postgres.entity';
import { UserMongo, UserMongoSchema } from '../schemas/user-mongo.schema';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'secret',
      database: 'postgres',
      entities: [UserPostgres],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserPostgres]),

    MongooseModule.forRoot('mongodb://admin:secret@localhost/user_media'),
    MongooseModule.forFeature([
      { name: UserMongo.name, schema: UserMongoSchema },
    ]),
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
