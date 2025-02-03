import { Controller } from '@nestjs/common';
import { KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user-service.service';
import { UserSignInDto } from '@lib/user/dto/user-sign-in.dto';
import { UserSignUpDto } from '@lib/user/dto/user-sign-up.dto';
import { UserUpdateDto } from '@lib/user/dto/user-update-dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.create')
  async handleRegistration(
    @Payload() userData: UserSignUpDto,
    @Payload() context: KafkaContext,
  ) {
    return await this.userService.createUser(userData);
  }

  @MessagePattern('user.created')
  async handleLogin(
    @Payload() signInDto: UserSignInDto,
    @Payload() context: KafkaContext,
  ) {
    return await this.userService.login(signInDto.username, signInDto.password);
  }

  @MessagePattern('user.get')
  async handleGetUser(
    @Payload() userId: string,
    @Payload() context: KafkaContext,
  ) {
    return await this.userService.getUserByUserId(userId);
  }

  @MessagePattern('user.update')
  async handleUpdateUser(
    @Payload() payload: { userId: string; data: UserUpdateDto },
    @Payload() context: KafkaContext,
  ) {
    return await this.userService.updateUser(payload.userId, payload.data);
  }

  @MessagePattern('user.delete')
  async handleDeleteUser(
    @Payload() userId: string,
    @Payload() context: KafkaContext,
  ) {
    return await this.userService.deleteUser(userId);
  }
}
