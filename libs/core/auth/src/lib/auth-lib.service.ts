import { UserGetDto, UserSignInDto, UserSignUpDto } from '@docu-tide/core/dtos';
import { EnvService } from '@docu-tide/core/env';
import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
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

  async createAccessToken(userGetDto: UserGetDto) {
    const jwtPayload: JwtPayload = {
      sub: userGetDto.userId,
      username: userGetDto.username,
      email: userGetDto.email,
    };

    return await this.jwtService.signAsync(jwtPayload, {
      secret: this.secret,
    });
  }

  async hashPassword(userSignUpDto: UserSignUpDto) {
    const salt = await bcryptjs.genSalt();
    return await bcryptjs.hash(userSignUpDto.password, salt);
  }

  async verifyPassword(userGetDto: UserGetDto, userSignInDto: UserSignInDto) {
    if (
      !userGetDto.userId ||
      !(await bcryptjs.compare(userSignInDto.password, userGetDto.hashPassword))
    ) {
      throw new UnauthorizedException('Uncorrect password');
    }
  }
}
