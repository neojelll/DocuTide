import { UserSignUpDto } from '@docu-tide/core/dtos';
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
}
