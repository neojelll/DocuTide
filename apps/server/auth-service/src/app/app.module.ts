import { AuthLibModule } from '@docu-tide/core/auth';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailService } from './mail/mail.service';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    AuthLibModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UserRepository, MailService],
})
export class AppModule {}
