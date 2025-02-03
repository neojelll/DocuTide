import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, KafkaContext } from '@nestjs/microservices';
import { UserService } from './user-service.service';
import { UserSignInDto } from '@lib/user/dto/user-sign-in.dto';
import { UserSignUpDto } from '@lib/user/dto/user-sign-up.dto';
import { UserUpdateDto } from '@lib/user/dto/user-update-dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.created')
  async handleLogin(
      @Payload() signInDto: UserSignInDto,
      @Payload() context: KafkaContext,
  ) {
    const { username, password } = signInDto;
    const loginResponse = await this.userService.login(username, password);
    const replyTopic = 'user.created.reply';
    return { topic: replyTopic, payload: loginResponse };
  }

  @MessagePattern('user.create')
  async handleRegistration(
      @Payload() userData: UserSignUpDto,
      @Payload() context: KafkaContext,
  ) {
    const createdUser = await this.userService.createUser(userData);
    const replyTopic = 'user.create.reply';
    return { topic: replyTopic, payload: createdUser };
  }

  @MessagePattern('user.get')
  async handleGetUser(
      @Payload() userId: string,
      @Payload() context: KafkaContext,
  ) {
    const user = await this.userService.getUserByUserId(userId);
    const replyTopic = 'user.get.reply';
    return { topic: replyTopic, payload: user };
  }

  @MessagePattern('user.update')
  async handleUpdateUser(
      @Payload()
      userUpdateData: {
        userId: string;
        data: UserUpdateDto;
      },
      @Payload() context: KafkaContext,
  ) {
    const updatedUser = await this.userService.updateUser(
        userUpdateData.userId,
        userUpdateData.data,
    );
    const replyTopic = 'user.update.reply';
    return { topic: replyTopic, payload: updatedUser };
  }

  @MessagePattern('user.delete')
  async handleDeleteUser(
      @Payload() userId: string,
      @Payload() context: KafkaContext,
  ) {
    const deletionResult = await this.userService.deleteUser(userId);
    const replyTopic = 'user.delete.reply';
    return { topic: replyTopic, payload: deletionResult };
  }
}
