import { Controller } from '@nestjs/common';
import {Ctx, KafkaContext, MessagePattern, Payload} from '@nestjs/microservices';
import { UserService } from './user-service.service';
import { UserSignInDto } from '@lib/user/dto/user-sign-in.dto';
import { UserSignUpDto } from '@lib/user/dto/user-sign-up.dto';
import { UserUpdateDto } from '@lib/user/dto/user-update.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.create')
  async handleRegistration(
    @Payload() userData: UserSignUpDto,
    @Ctx() context: KafkaContext,
  ) {
    return await this.userService.createUser(userData);
  }

  @MessagePattern('user.created')
  async handleLogin(
      @Payload() signInDto: UserSignInDto,
      @Ctx() context: KafkaContext,
  ) {
    console.log(`[handleLogin] Received message on topic 'user.created': ${JSON.stringify(signInDto)}`);
    const user = await this.userService.getUserByUsername(signInDto.username);
    console.log(`[handleLogin] Retrieved user: ${JSON.stringify(user)}`);
    return user;
  }

  @MessagePattern('user.get')
  async handleGetUser(
    @Payload() userId: string,
    @Ctx() context: KafkaContext,
  ) {
    return await this.userService.getUserByUserId(userId);
  }

  @MessagePattern('user.update')
  async handleUpdateUser(
    @Payload() payload: { userId: string; data: UserUpdateDto },
    @Ctx() context: KafkaContext,
  ) {
    return await this.userService.updateUser(payload.userId, payload.data);
  }

  @MessagePattern('user.delete')
  async handleDeleteUser(
    @Payload() userId: string,
    @Ctx() context: KafkaContext,
  ) {
    return await this.userService.deleteUser(userId);
  }
}
