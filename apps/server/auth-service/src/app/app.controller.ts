import { UserSignInDto, UserSignUpDto } from '@docu-tide/core';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserExists } from '../interfaces/user-exists.interface';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(process.env['AUTH_SIGN_UP_TOPIC'])
  async handleSignUp(
    @Payload() userSignUpDto: UserSignUpDto,
  ): Promise<string | UserExists> {
    console.log('Started handleSignUp');
    return await this.appService.signUp(userSignUpDto);
  }

  @MessagePattern(process.env['AUTH_CONFIRM_EMAIL_TOPIC'])
  async handleConfirmEmail(@Payload() confirmEmailToken: string) {
    console.log('Started handleConfirmEmail');
    return await this.appService.confirmEmail(confirmEmailToken);
  }

  @MessagePattern(process.env['AUTH_SIGN_IN_TOPIC'])
  async handleSignIp(@Payload() userSignInDto: UserSignInDto) {
    console.log('Startes handleSignIn');
    return await this.appService.signIn(userSignInDto);
  }
}
