import { Module } from '@nestjs/common';
import { PrismaService } from '../../schemas';
import { UserRepository } from './user.repository';

@Module({
  controllers: [],
  providers: [PrismaService, UserRepository],
  exports: [UserRepository],
})
export class RepositoriesModule {}
