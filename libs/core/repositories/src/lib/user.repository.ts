import { Injectable } from '@nestjs/common';
import { User, PrismaService } from '@docu-tide/core';
import { UserSignUpDto, UserUpdateDto } from '@docu-tide/core';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: UserSignUpDto, hashPassword: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        hashPassword,
      },
    });
  }

  async findAll(): Promise<User[] | null> {
    return this.prisma.user.findMany();
  }

  async find(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { userId },
    });
  }

  async update(userId: string, data: UserUpdateDto): Promise<User> {
    return this.prisma.user.update({
      where: { userId },
      data,
    });
  }
  async delete(userId: string): Promise<User> {
    return this.prisma.user.delete({
      where: { userId },
    });
  }
}
