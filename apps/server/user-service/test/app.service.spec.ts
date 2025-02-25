import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserGetDto, UserUpdateDto } from '@docu-tide/core/dtos';
import { UserService } from '../src/app/app.service';
import { PrismaService } from '../src/app/prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getAllUsers', () => {
    it('should return array of user strings', async () => {
      const users = [{ username: 'user1' }, { username: 'user2' }];
      prisma.user.findMany.mockResolvedValue(users);
      const result = await service.getAllUsers();
      expect(result).toEqual(users.map((u) => new UserGetDto(u).stringify()));
    });

    it('should return empty array when no users exist', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      expect(await service.getAllUsers()).toEqual([]);
    });
  });

  describe('getUserByUserId', () => {
    it('should return user string if user exists', async () => {
      const user = { userId: 'id', username: 'user' };
      prisma.user.findUnique.mockResolvedValue(user);
      expect(await service.getUserByUserId('id')).toBe(
        new UserGetDto(user).stringify(),
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getUserByUserId('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUserByUsername', () => {
    it('should return user string if username exists', async () => {
      const user = { username: 'user' };
      prisma.user.findUnique.mockResolvedValue(user);
      expect(await service.getUserByUsername('user')).toBe(
        new UserGetDto(user).stringify(),
      );
    });

    it('should throw NotFoundException if username not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getUserByUsername('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update user data successfully', async () => {
      const user = { userId: 'id', username: 'updatedUser' };
      prisma.user.update.mockResolvedValue(user);
      const dto: UserUpdateDto = {
        jwtPayload: { sub: 'id' },
        username: 'updatedUser',
      };
      expect(await service.updateUser('id', dto)).toBe(
        new UserGetDto(user).stringify(),
      );
    });

    it('should throw NotFoundException if user not found during update', async () => {
      prisma.user.update.mockResolvedValue(null);
      const dto: UserUpdateDto = {
        jwtPayload: { sub: 'id' },
        username: 'updatedUser',
      };
      await expect(service.updateUser('id', dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle partial updates correctly', async () => {
      const user = { userId: 'id', bio: 'new bio' };
      prisma.user.update.mockResolvedValue(user);
      const dto: UserUpdateDto = { jwtPayload: { sub: 'id' }, bio: 'new bio' };
      expect(await service.updateUser('id', dto)).toBe(
        new UserGetDto(user).stringify(),
      );
    });
  });
});
