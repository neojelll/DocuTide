import { JwtAuthGuard, JwtDecode, JwtPayload } from '@docu-tide/core/auth';
import { UserUpdateDto } from '@docu-tide/user/lib/dto';
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
import { UsersService } from './users.service';

@Controller()
export class UsersController implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    @Inject('USERS_MICROSERVICE') private readonly usersClient: ClientKafka
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async getUser(@JwtDecode() user: JwtPayload) {
    return await this.usersService.getUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('settings/profile')
  async updateUser(
    @JwtDecode() user: JwtPayload,
    @Body(ValidationPipe) userUpdateDto: UserUpdateDto
  ) {
    return await this.usersService.updateUser(user, userUpdateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('settings/admin')
  async deleteUser(@JwtDecode() user: JwtPayload) {
    return await this.usersService.deleteUser(user);
  }

  async onModuleInit() {
    this.usersClient.subscribeToResponseOf(
      process.env.USER_GET_TOPIC || 'user.get'
    );
    this.usersClient.subscribeToResponseOf(
      process.env.USER_UPDATE_TOPIC || 'user.update'
    );
    this.usersClient.subscribeToResponseOf(
      process.env.USER_DELETE_TOPIC || 'user.delete'
    );
    await this.usersClient.connect();
  }
}
