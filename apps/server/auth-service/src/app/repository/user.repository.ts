import { UserSignUpDto } from '@docu-tide/core/dtos';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  DatabaseCheckError,
  DatabaseCreateError,
} from '../../errors/database.errors';
import { UserExists } from '../../interfaces/user-exists.interface';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    userSignUpDto: UserSignUpDto,
    hashPassword: string,
  ): Promise<User> {
    try {
      console.log(`Start creating user: ${userSignUpDto.username}`);
      const newUser: User = await this.prisma.user.create({
        data: {
          email: userSignUpDto.email,
          username: userSignUpDto.username,
          hashPassword: hashPassword,
          emailConfirmed: false,
          notificationsEnabled: userSignUpDto.receiveNotifications,
        },
      });
      console.log(`Successfully user created: ${JSON.stringify(newUser)}`);
      return newUser;
    } catch (error) {
      console.error(`Error creating user: ${error.message}`);
      throw new DatabaseCreateError(`Error creating user: ${error.message}`);
    }
  }

  async checkUser(userSignUpDto: UserSignUpDto): Promise<UserExists | null> {
    try {
      console.log(`Start checking user: ${userSignUpDto.username}`);
      const [existingUserByUsername, existingUserByEmail] =
        await this.prisma.$transaction([
          this.prisma.user.findUnique({
            where: { username: userSignUpDto.username },
          }),
          this.prisma.user.findUnique({
            where: { email: userSignUpDto.email },
          }),
        ]);

      console.log('Successfully check user in database');

      if (existingUserByUsername || existingUserByEmail) {
        console.log(`User is already exists`);
        return {
          message: existingUserByUsername
            ? 'A user with this username is already exists'
            : 'A user with this email is already exists',
        };
      }

      console.log('User not exists');

      return null;
    } catch (error) {
      console.error(`Error when check user: ${error.message}`);
      throw new DatabaseCheckError(`Error when check user: ${error.message}`);
    }
  }
}
