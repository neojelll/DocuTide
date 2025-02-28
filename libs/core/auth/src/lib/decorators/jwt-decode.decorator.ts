import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const JwtDecode = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    const jwtService = new JwtService({ secret: process.env['JWT_SECRET'] });

    try {
      const decode = jwtService.verify(token);
      return decode;
    } catch (error) {
      throw new UnauthorizedException(`Invalid token: ${error}`);
    }
  },
);
