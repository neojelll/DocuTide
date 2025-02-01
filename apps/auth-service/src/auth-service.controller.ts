import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { AuthServiceService } from './auth-service.service'

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @MessagePattern(process.env.USER_CREATE_TOPIC || 'user_create')
  async handleUserSignUp(@Payload() userData: any) {
      try {
        console.log(userData);
        return await this.authServiceService.getHello(userData);
      } catch (error) {
        console.error('Error handling user sign up:', error);
        throw error;
      }
  }
}
