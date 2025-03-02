import { UserGetDto, UserUpdateDto } from '@docu-tide/core/dtos';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '@docu-tide/core/schemas';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(): Promise<string[]> {
    this.logger.log('Fetching all users from database');
    try {
      const users = await this.prisma.user.findMany();
      this.logger.debug(`Retrieved ${users.length} users from database`);

      const result = await Promise.all(
        users.map(async (user) => {
          return new UserGetDto(user).stringify();
        }),
      );

      this.logger.debug('Successfully processed all users');
      return result;
    } catch (error) {
      this.logger.error('Failed to fetch all users', error.stack);
      throw error;
    }
  }

  async getUserByUserId(userId: string): Promise<string> {
    this.logger.log(`Fetching user with ID: ${userId}`);
    try {
      const user = await this.prisma.user.findUnique({
        where: { userId },
      });

      if (!user) {
        this.logger.warn(`User with ID ${userId} not found`);
        throw new NotFoundException(`User with ID "${userId}" not found.`);
      }

      const result = new UserGetDto(user).stringify();
      this.logger.debug(`Successfully retrieved user with ID: ${userId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch user with ID: ${userId}`, error.stack);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<string> {
    this.logger.log(`Fetching user with username: ${username}`);
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        this.logger.warn(`User with username ${username} not found`);
        throw new NotFoundException(`User "${username}" not found.`);
      }

      const result = new UserGetDto(user).stringify();
      this.logger.debug(
        `Successfully retrieved user with username: ${username}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to fetch user with username: ${username}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateUser(userId: string, data: UserUpdateDto): Promise<string> {
    this.logger.log(`Updating user with ID: ${userId}`);
    try {
      const { jwtPayload, ...validData } = data;
      const updatedUser = await this.prisma.user.update({
        where: { userId },
        data: validData,
      });

      if (!updatedUser) {
        this.logger.warn(`User with ID ${userId} not found for update`);
        throw new NotFoundException(`User with ID "${userId}" not found.`);
      }

      const result = new UserGetDto(updatedUser).stringify();
      this.logger.debug(`Successfully updated user with ID: ${userId}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to update user with ID: ${userId}`,
        error.stack,
      );
      throw error;
    }
  }
}
