import { JwtAuthGuard, JwtDecode, JwtPayload } from '@docu-tide/core/auth';
import { ValidationUserUpdateDto } from '@docu-tide/core/dtos';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller('users')
export class UserController implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    @Inject('USERS_MICROSERVICE') private readonly userClient: ClientKafka,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@JwtDecode() jwtPayload: JwtPayload) {
    return await this.userService.getUser(jwtPayload);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUser(
    @JwtDecode() jwtPayload: JwtPayload,
    @Body(ValidationPipe) validationUserUpdateDto: ValidationUserUpdateDto,
  ) {
    return await this.userService.updateUser(
      jwtPayload,
      validationUserUpdateDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove')
  async removeUser(@JwtDecode() jwtPayload: JwtPayload) {
    return await this.userService.removeUser(jwtPayload);
  }

  async onModuleInit() {
    this.userClient.subscribeToResponseOf(process.env['USER_GET_TOPIC']);
    this.userClient.subscribeToResponseOf(process.env['USER_UPDATE_TOPIC']);
    this.userClient.subscribeToResponseOf(process.env['USER_DELETE_TOPIC']);
    await this.userClient.connect();
  }
}
