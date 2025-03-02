import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = process.env['JWT_SECRET'];

    if (!secret) {
      throw new UnauthorizedException('JWT secret is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => {
          const cookieFileName: string | undefined =
            process.env['COOKIE_FILE_NAME'];
          if (!cookieFileName) {
            throw new NotFoundException(
              'not fount cookie file name in .env file',
            );
          }
          return req.cookies[cookieFileName];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    return { userId: payload.sub, username: payload.username };
  }
}
