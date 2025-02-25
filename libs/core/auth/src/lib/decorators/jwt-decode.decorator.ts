import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const JwtDecode = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const cookieFileName: string | undefined = process.env['COOKIE_FILE_NAME'];
    if (!cookieFileName) {
      throw new NotFoundException('not fount cookie file name in .env file');
    }
    const token = request.cookies[cookieFileName];

    if (!token) {
      return null;
    }

    const jwtService = new JwtService({ secret: process.env['JWT_SECRET'] });

    try {
      const decode = jwtService.verify(token);
      return decode;
    } catch (Error) {
      return Error;
    }
  },
);
