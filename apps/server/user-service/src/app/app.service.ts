import { Injectable } from '@nestjs/common';
import {
  UserGetDto,
  JwtPayload,
  UserUpdateDto,
  UserRepository,
  DatabaseGetError,
  UserIdentifierType,
  DatabaseUpdateError,
} from '@docu-tide/core';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<string[]> {
    try {
      console.log('Fetching all users from repository');
      const users = await this.userRepository.getAll();
      console.debug(`Retrieved ${users.length} users from repository`);

      const result = await Promise.all(
        users.map(async (user) => {
          return new UserGetDto(user).stringify();
        }),
      );

      console.debug('Successfully processed all users');
      return result;
    } catch (error) {
      console.error('Failed to fetch all users', error.stack);
      throw error;
    }
  }

  async getUser(jwtPayload: JwtPayload): Promise<string> {
    const { sub } = jwtPayload;
    try {
      console.log(`Fetching user with ID: ${sub}`);
      const user = await this.userRepository.get({
        type: UserIdentifierType.userId,
        value: sub,
      });

      if (!user) {
        console.warn(`User with ID ${sub} not found`);
        throw new DatabaseGetError(`User with ID "${sub}" not found.`);
      }

      const result = new UserGetDto(user).stringify();
      console.debug(`Successfully retrieved user with ID: ${sub}`);
      return result;
    } catch (error) {
      console.error(`Failed to fetch user with ID: ${sub}`, error.stack);
      throw error;
    }
  }

  async updateUser(userUpdateDto: UserUpdateDto): Promise<string> {
    const { sub } = userUpdateDto.jwtPayload;
    try {
      console.log(`Updating user with ID: ${sub}`);
      const { jwtPayload, ...validData } = userUpdateDto;
      const updatedUser = await this.userRepository.update(sub, validData);

      if (!updatedUser) {
        console.warn(`User with ID ${sub} not found for update`);
        throw new DatabaseUpdateError(`User with ID "${sub}" not found.`);
      }

      const result = new UserGetDto(updatedUser).stringify();
      console.debug(`Successfully updated user with ID: ${sub}`);
      return result;
    } catch (error) {
      console.error(`Failed to update user with ID: ${sub}`, error.stack);
      throw error;
    }
  }
}
