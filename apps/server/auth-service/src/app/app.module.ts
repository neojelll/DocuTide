import { AuthLibModule } from '@docu-tide/auth';
import { SchemasModule } from '@docu-tide/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailService } from './mail/mail.service';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    AuthLibModule,
    SchemasModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UserRepository, MailService],
})
export class AppModule {}
