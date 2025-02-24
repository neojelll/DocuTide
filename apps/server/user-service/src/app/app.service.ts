import { UserGetDto, UserSignUpDto, UserUpdateDto } from '@docu-tide/core/dtos';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: UserSignUpDto): Promise<string> {
    console.log('Cr eating user with data:', data);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        hashPassword: data.password,
      },
    });

    return new UserGetDto(user).stringify();
  }

  async getAllUsers(): Promise<string[]> {
    console.log('Fetching all users...');
    const users = await this.prisma.user.findMany();
    console.log('Fetched users:', users);
    return Promise.all(
      users.map(async (user) => {
        console.log('User:', user);
        return new UserGetDto(user).stringify();
      }),
    );
  }

  async getUserByUserId(userId: string): Promise<string> {
    console.log(`Fetching user with ID: ${userId}`);
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });
    if (!user) {
      console.log(`User with ID "${userId}" not found.`);
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }
    console.log('Found user:', user);
    return new UserGetDto(user).stringify();
  }

  async getUserByUsername(username: string): Promise<string> {
    console.log(`Fetching user with username: ${username}`);
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      console.log(`User with username "${username}" not found.`);
      throw new NotFoundException(`User "${username}" not found.`);
    }
    console.log('Found user:', user);
    return new UserGetDto(user).stringify();
  }

  async updateUser(userId: string, data: UserUpdateDto): Promise<string> {
    console.log(`Updating user with ID: ${userId} with data:`, data);
    const { jwtPayload, ...validData } = data;
    const updatedUser = await this.prisma.user.update({
      where: { userId },
      data: validData,
    });

    if (!updatedUser) {
      console.log(`User with ID "${userId}" not found.`);
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }

    console.log('Updated user:', updatedUser);
    return new UserGetDto(updatedUser).stringify();
  }

  async removeUser(userId: string): Promise<string> {
    console.log(`Removing user with ID: ${userId}`);
    const deletedUser = await this.prisma.user.delete({
      where: { userId },
    });
    if (!deletedUser) {
      console.log(`User with ID "${userId}" not found.`);
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }
    console.log(`User with ID ${userId} deleted successfully.`);
    return `User with ID ${userId} deleted successfully.`;
  }
}
