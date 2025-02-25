import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './app.controller';
import { UserService } from './app.service';
import { PrismaService } from '@docu-tide/core/schemas';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class AppModule {}
