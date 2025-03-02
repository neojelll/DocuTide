import { JwtPayload } from '@docu-tide/core/auth';
import { UserSignInDto, UserUpdateDto } from '@docu-tide/core/dtos';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './app.service';

@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @MessagePattern(process.env['USER_CREATED_TOPIC'])
  async handleLogin(@Payload() signInDto: UserSignInDto) {
    this.logger.log(
      `Handling login request for username: ${signInDto.username}`,
    );
    try {
      const result = await this.userService.getUserByUsername(
        signInDto.username,
      );
      this.logger.debug(
        `Successfully processed login for username: ${signInDto.username}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to process login for username: ${signInDto.username}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern(process.env['USER_GET_ALL_TOPIC'])
  async handleGetAll() {
    this.logger.log('Handling get all users request');
    try {
      const result = await this.userService.getAllUsers();
      this.logger.debug(`Successfully retrieved ${result.length} users`);
      return result;
    } catch (error) {
      this.logger.error('Failed to get all users', error.stack);
      throw error;
    }
  }

  @MessagePattern(process.env['USER_GET_TOPIC'])
  async handleGet(@Payload() payload: JwtPayload) {
    this.logger.log(`Handling get user request for userId: ${payload.sub}`);
    try {
      const result = await this.userService.getUserByUserId(payload.sub);
      this.logger.debug(`Successfully retrieved user with ID: ${payload.sub}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to get user with ID: ${payload.sub}`,
        error.stack,
      );
      throw error;
    }
  }

  @MessagePattern(process.env['USER_UPDATE_TOPIC'])
  async handleUpdate(@Payload() payload: UserUpdateDto) {
    this.logger.log(
      `Handling update request for userId: ${payload.jwtPayload.sub}`,
    );
    try {
      const result = await this.userService.updateUser(
        payload.jwtPayload.sub,
        payload,
      );
      this.logger.debug(
        `Successfully updated user with ID: ${payload.jwtPayload.sub}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to update user with ID: ${payload.jwtPayload.sub}`,
        error.stack,
      );
      throw error;
    }
  }
}
