import { EnvService } from '@docu-tide/core/env';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthLibService implements OnModuleInit {
  private secret: string;

  constructor(
    private readonly envService: EnvService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    this.secret = await this.envService.getEnvValue('JWT_SECRET');
  }

  async createAccessToken(jwtPayload: JwtPayload) {
    return {
      access_token: await this.jwtService.signAsync(jwtPayload, {
        secret: this.secret,
      }),
    };
  }
}
