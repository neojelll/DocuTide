import { JwtPayload } from '@docu-tide/core/auth';
import { UserUpdateDto } from '@docu-tide/core/dtos';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './app.service';

@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @MessagePattern(process.env['USER_GET_ALL_TOPIC'])
  async handleGetAll() {
    this.logger.log('Handling get all users request');
    const result = await this.userService.getAllUsers();
    this.logger.debug(`Successfully retrieved ${result.length} users`);
    return result;
  }

  @MessagePattern(process.env['USER_GET_TOPIC'])
  async handleGet(@Payload() payload: JwtPayload) {
    this.logger.log(`Handling get user request: ${payload}`);
    const result = await this.userService.getUser(payload);
    this.logger.debug(`Successfully retrieved user: ${payload}`);
    return result;
  }

  @MessagePattern(process.env['USER_UPDATE_TOPIC'])
  async handleUpdate(@Payload() payload: UserUpdateDto) {
    this.logger.log(
      `Handling update request for userId: ${payload.jwtPayload.sub}`,
    );
    const result = await this.userService.updateUser(
      payload.jwtPayload,
      payload,
    );
    this.logger.debug(
      `Successfully updated user with ID: ${payload.jwtPayload.sub}`,
    );
    return result;
  }
}
