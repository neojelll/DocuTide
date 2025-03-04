import { Injectable } from '@nestjs/common';
import { User, Prisma, PrismaService } from '../schemas';
import {
  DatabaseCreateError,
  DatabaseGetError,
  DatabaseUpdateError,
  DatabaseDeleteError,
} from '../errors';
import { UserIdentifierType } from '../enums';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userData: Prisma.UserCreateInput): Promise<User> {
    console.log('Starting user creation process', JSON.stringify(userData));

    try {
      console.log('Attempting to create user in database', {
        email: userData.email,
        username: userData.username,
      });

      const user = await this.prisma.user.create({
        data: {
          ...userData,
        },
      });

      console.log('User successfully created', {
        userId: user.userId,
        email: user.email,
      });
      return user;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.log('Unique constraint violation during user creation', {
            error: error.message,
            fields: error.meta?.['target'],
          });
          throw new DatabaseCreateError(
            `User creation failed: duplicate ${error.meta?.['target']}`,
          );
        }
        console.log('Database error during user creation', {
          code: error.code,
          message: error.message,
          stack: error.stack,
        });
        throw new DatabaseCreateError(`Database error: ${error.message}`);
      }

      const err = error as Error;
      console.log('Unexpected error during user creation', {
        message: err.message,
        stack: err.stack,
      });
      throw new DatabaseCreateError(`Unexpected error: ${err.message}`);
    }
  }

  async getAll(): Promise<User[]> {
    console.log('Starting retrieval of all users');

    try {
      console.log('Fetching all users from database');
      const users = await this.prisma.user.findMany();

      if (!users || users.length === 0) {
        console.log('No users found in database');
        return [];
      }

      console.log('Successfully retrieved users', { count: users.length });
      return users;
    } catch (error: unknown) {
      const err = error as Error;
      console.log('Error while fetching all users', {
        message: err.message,
        stack: err.stack,
      });
      throw new DatabaseGetError(`Failed to fetch users: ${err.message}`);
    }
  }

  async get(identifier: {
    type: UserIdentifierType;
    value: string;
  }): Promise<User | null> {
    console.log('Starting user retrieval', { identifier });

    if (!identifier.value) {
      console.log('Invalid identifier value provided for get operation', {
        identifier,
      });
      throw new DatabaseGetError(`${identifier.type} cannot be empty`);
    }

    try {
      console.log('Attempting to fetch user from database', { identifier });
      const user = await this.prisma.user.findUnique({
        where: {
          [identifier.type]: identifier.value,
        } as unknown as Prisma.UserWhereUniqueInput,
      });

      if (!user) {
        console.log('User not found', { identifier });
        return null;
      }

      console.log('User successfully retrieved', {
        userId: user.userId,
        email: user.email,
      });
      return user;
    } catch (error: unknown) {
      const err = error as Error;
      console.log('Error while fetching user', {
        identifier,
        message: err.message,
        stack: err.stack,
      });
      throw new DatabaseGetError(`Failed to fetch user: ${err.message}`);
    }
  }

  async update(userId: string, data: Prisma.UserUpdateInput): Promise<User> {
    console.log('Starting user update process', { userId });

    if (!userId) {
      console.log('Invalid userId provided for update operation', { userId });
      throw new DatabaseUpdateError('User ID cannot be empty');
    }

    try {
      console.log('Attempting to update user in database', {
        userId,
        updateData: data,
      });
      const updatedUser = await this.prisma.user.update({
        where: { userId },
        data,
      });

      console.log('User successfully updated', {
        userId: updatedUser.userId,
        email: updatedUser.email,
      });
      return updatedUser;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          console.log('User not found for update', {
            userId,
            message: error.message,
          });
          throw new DatabaseUpdateError(`User with ID ${userId} not found`);
        }
        console.log('Database error during user update', {
          userId,
          code: error.code,
          message: error.message,
          stack: error.stack,
        });
        throw new DatabaseUpdateError(`Database error: ${error.message}`);
      }

      const err = error as Error;
      console.log('Unexpected error during user update', {
        userId,
        message: err.message,
        stack: err.stack,
      });
      throw new DatabaseUpdateError(`Unexpected error: ${err.message}`);
    }
  }

  async delete(userId: string): Promise<User> {
    console.log('Starting user deletion process', { userId });

    if (!userId) {
      console.log('Invalid userId provided for delete operation', { userId });
      throw new DatabaseDeleteError('User ID cannot be empty');
    }

    try {
      console.log('Attempting to delete user from database', { userId });
      const deletedUser = await this.prisma.user.delete({
        where: { userId },
      });

      console.log('User successfully deleted', {
        userId: deletedUser.userId,
        email: deletedUser.email,
      });
      return deletedUser;
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          console.log('User not found for deletion', {
            userId,
            message: error.message,
          });
          throw new DatabaseDeleteError(`User with ID ${userId} not found`);
        }
        console.log('Database error during user deletion', {
          userId,
          code: error.code,
          message: error.message,
          stack: error.stack,
        });
        throw new DatabaseDeleteError(`Database error: ${error.message}`);
      }

      const err = error as Error;
      console.log('Unexpected error during user deletion', {
        userId,
        message: err.message,
        stack: err.stack,
      });
      throw new DatabaseDeleteError(`Unexpected error: ${err.message}`);
    }
  }
}
