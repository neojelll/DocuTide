import { JwtPayload } from '@docu-tide/core';
import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthLibService implements OnModuleInit {
  private secret: string;

  constructor(private readonly jwtService: JwtService) {}

  async onModuleInit() {
    const secret = process.env['JWT_SECRET'];

    if (!secret) {
      throw new InternalServerErrorException();
    }

    this.secret = secret;
  }

  async createConfirmEmailToken(username: string, email: string) {
    const payload = {
      username,
      email,
    };

    return await this.jwtService.signAsync(payload, {
      secret: this.secret,
      expiresIn: Number(process.env['CONFIRM_EMAIL_TOKEN_EXPIRES']),
    });
  }

  async verifyConfirmEmailToken(confirmEmailToken: string) {
    return await this.jwtService.verifyAsync(confirmEmailToken);
  }

  async createAccessToken(userId: string, username: string, email: string) {
    const jwtPayload: JwtPayload = {
      sub: userId,
      username,
      email,
    };

    return await this.jwtService.signAsync(jwtPayload, {
      secret: this.secret,
    });
  }

  async hashPassword(password: string) {
    const salt = await bcryptjs.genSalt();
    return await bcryptjs.hash(password, salt);
  }

  async verifyPassword(userId: string, password: string, hashPassword: string) {
    if (!userId || !(await bcryptjs.compare(password, hashPassword))) {
      throw new UnauthorizedException('Uncorrect password');
    }
  }
}
