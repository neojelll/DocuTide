import { EnvModule } from '@docu-tide/core/env';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthLibService } from './auth-lib.service';

@Module({
  imports: [
    EnvModule,
    PassportModule,
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
      signOptions: {
        expiresIn: process.env['JWT_EXPIRES'],
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [],
  providers: [AuthLibService],
  exports: [AuthLibService],
})
export class AuthLibModule {}
