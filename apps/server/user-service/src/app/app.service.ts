import { UserGetDto, UserUpdateDto } from '@docu-tide/core/dtos';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '@docu-tide/core/schemas';
import { JwtPayload } from '@docu-tide/core/auth';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(): Promise<string[]> {
    try {
      this.logger.log('Fetching all users from database');
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

  async getUser(payload: JwtPayload): Promise<string> {
    const { sub } = payload;
    try {
      this.logger.log(`Fetching user with ID: ${sub}`);
      const user = await this.prisma.user.findUnique({
        where: { userId: sub },
      });

      if (!user) {
        this.logger.warn(`User with ID ${sub} not found`);
        throw new NotFoundException(`User with ID "${sub}" not found.`);
      }

      const result = new UserGetDto(user).stringify();
      this.logger.debug(`Successfully retrieved user with ID: ${sub}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch user with ID: ${sub}`, error.stack);
      throw error;
    }
  }

  async updateUser(payload: JwtPayload, data: UserUpdateDto): Promise<string> {
    const { sub } = payload;
    try {
      this.logger.log(`Updating user with ID: ${sub}`);
      const { jwtPayload, ...validData } = data;
      const updatedUser = await this.prisma.user.update({
        where: { userId: sub },
        data: validData,
      });

      if (!updatedUser) {
        this.logger.warn(`User with ID ${sub} not found for update`);
        throw new NotFoundException(`User with ID "${sub}" not found.`);
      }

      const result = new UserGetDto(updatedUser).stringify();
      this.logger.debug(`Successfully updated user with ID: ${sub}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update user with ID: ${sub}`, error.stack);
      throw error;
    }
  }
}
