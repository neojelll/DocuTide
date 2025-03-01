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
  ValidationPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
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
  async confirmEmail(@Param('confirmEmailToken') confirmEmailToken: string) {
    return await this.authService.confirmEmail(confirmEmailToken);
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
