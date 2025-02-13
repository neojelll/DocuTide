import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const JwtDecode = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return null;
    }

    const jwtService = new JwtService({ secret: process.env['JWT_SECRET'] });

    try {
      const decode = jwtService.verify(token);
      return decode;
    } catch (Error) {
      return null;
    }
  },
);
