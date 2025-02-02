import { UserUpdateDto } from '@lib/user/dto'
import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, Patch, ValidationPipe } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    @Inject('USERS_MICROSERVICE') private readonly usersClient: ClientKafka,
  ) {}

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return await this.usersService.getUser(userId);
  }

  @Patch(':userId')
  async updateUser(@Param('userId') userId: string, @Body(ValidationPipe) userUpdateDto: UserUpdateDto) {
    return await this.usersService.updateUser(userId, userUpdateDto);
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return await this.usersService.deleteUser(userId);
  }

  async onModuleInit() {
    this.usersClient.subscribeToResponseOf(process.env.USER_GET_TOPIC || 'user.get');
    this.usersClient.subscribeToResponseOf(process.env.USER_UPDATE_TOPIC || 'user.update');
    this.usersClient.subscribeToResponseOf(process.env.USER_DELETE_TOPIC || 'user.delete');
    await this.usersClient.connect();
  }
}
