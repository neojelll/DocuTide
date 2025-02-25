import { UserGetDto, UserUpdateDto } from '@docu-tide/core/dtos';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@docu-tide/core/schemas';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(): Promise<string[]> {
    const users = await this.prisma.user.findMany();
    return Promise.all(
      users.map(async (user) => {
        return new UserGetDto(user).stringify();
      }),
    );
  }

  async getUserByUserId(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }
    return new UserGetDto(user).stringify();
  }

  async getUserByUsername(username: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException(`User "${username}" not found.`);
    }
    return new UserGetDto(user).stringify();
  }

  async updateUser(userId: string, data: UserUpdateDto): Promise<string> {
    const { jwtPayload, ...validData } = data;
    const updatedUser = await this.prisma.user.update({
      where: { userId },
      data: validData,
    });

    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }

    return new UserGetDto(updatedUser).stringify();
  }
}
