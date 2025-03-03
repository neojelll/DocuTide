import { PrismaService, User, UserSignUpDto } from '@docu-tide/core';
import { Injectable } from '@nestjs/common';
import {
  DatabaseCheckError,
  DatabaseCreateError,
  DatabaseDeleteError,
  DatabaseGetError,
  DatabaseUpdateError,
} from '../../errors/database.errors';
import { UserExists } from '../../interfaces/user-exists.interface';

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

  async confirmEmail(username: string, email: string): Promise<User> {
    try {
      console.log(`Start update confirm email user: ${username}`);

      const updateUser: User = await this.prisma.user.update({
        where: {
          username: username,
          email: email,
        },
        data: {
          emailConfirmed: true,
        },
      });

      console.log(
        `Successfully update confirm email user: ${JSON.stringify(
          updateUser,
        )}'`,
      );
      return updateUser;
    } catch (error) {
      console.error(`Error when update confirm email user: ${error.message}`);
      throw new DatabaseUpdateError(
        `Error when update confirm email user: ${error.message}`,
      );
    }
  }

  async getUser(username: string) {
    try {
      console.log(`Start get user: ${username}`);

      const user: User = await this.prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      console.log(`Successfully get user: ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      console.error(
        `Error when get user: ${username}, error: ${error.message}`,
      );
      throw new DatabaseGetError(`Error when get user: ${error.message}`);
    }
  }

  async deleteUser(userId: string, username: string): Promise<User> {
    try {
      console.log(`Start delete user: ${username}`);

      const deleteUser: User = await this.prisma.user.delete({
        where: {
          userId: userId,
          username: username,
        },
      });

      console.log(`Successfully deleted user: ${JSON.stringify(deleteUser)}`);
      return deleteUser;
    } catch (error) {
      console.error(`Error when delete user: ${error.message}`);
      throw new DatabaseDeleteError(`Error when delete user: ${error.message}`);
    }
  }
}
