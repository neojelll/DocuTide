import { UserSignInDto, UserSignUpDto } from '@docu-tide/core/dtos';
import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Request,
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

  @Get('confirm-email/:confirmEmailToken')
  async confirmEmail(
    @Res() response: Response,
    @Param('confirmEmailToken') confirmEmailToken: string,
  ) {
    await this.authService.confirmEmail(confirmEmailToken);
    return response.redirect(301, process.env['HOME_PAGE_URL']);
  }

  @Post('sign-in')
  async signIn(@Body(ValidationPipe) userSignInDto: UserSignInDto) {
    const token: string = await this.authService.signIn(userSignInDto);
    return { access_token: token };
  }

  @Post('sign-out')
  async signOut(@Request() req) {
    return await this.authService.signOut(
      req.headers.authorization.split(' ')[1],
    );
  }

  async onModuleInit() {
    this.authClient.subscribeToResponseOf(process.env['AUTH_SIGN_UP_TOPIC']);
    this.authClient.subscribeToResponseOf(
      process.env['AUTH_CONFIRM_EMAIL_TOPIC'],
    );
    this.authClient.subscribeToResponseOf(process.env['AUTH_SIGN_IN_TOPIC']);
    this.authClient.subscribeToResponseOf(process.env['AUTH_SIGN_OUT_TOPIC']);
    await this.authClient.connect();
  }
}
