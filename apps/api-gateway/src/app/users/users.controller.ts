import { UserUpdateDto } from '@docu-tide/user/lib/dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller()
export class UsersController implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    @Inject('USERS_MICROSERVICE') private readonly usersClient: ClientKafka
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async getUser(@Param('username') username: string, @Req() request: Request) {
    return await this.usersService.getUser(request, username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('settings/profile')
  async updateUser(
    @Body(ValidationPipe) userUpdateDto: UserUpdateDto,
    @Req() request: Request
  ) {
    return await this.usersService.updateUser(request, userUpdateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('settings/admin')
  async deleteUser(@Req() request: Request) {
    return await this.usersService.deleteUser(request);
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
