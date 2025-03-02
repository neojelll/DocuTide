import { UserSignInDto, UserSignUpDto } from '@docu-tide/core';
import {
  Body,
  Controller,
  Inject,
  OnModuleInit,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
  ) {}

  @Post('sign-up')
  async signUp(@Body(ValidationPipe) userSignUpDto: UserSignUpDto) {
    return await this.authService.signUp(userSignUpDto);
  }

  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body(ValidationPipe) userSignInDto: UserSignInDto,
  ) {
    const token: string = await this.authService.signIn(userSignInDto);
    response.cookie(process.env['COOKIE_FILE_NAME'], token, {
      httpOnly: Boolean(process.env['COOKIE_HTTP_ONLY']),
    });
    return { message: 'Successfully signed in' };
  }

  @Post('sign-out')
  async signOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(process.env['COOKIE_FILE_NAME'], {
      httpOnly: Boolean(process.env['COOKIE_HTTP_ONLY']),
    });
    return { message: 'Successfully signed out' };
  }

  async onModuleInit() {
    this.authClient.subscribeToResponseOf(process.env['AUTH_SIGN_UP_TOPIC']);
    this.authClient.subscribeToResponseOf(process.env['AUTH_SIGN_IN_TOPIC']);
    await this.authClient.connect();
  }
}
