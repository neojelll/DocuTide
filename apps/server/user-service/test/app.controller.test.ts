import { vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { UserService } from '../src/app/app.service.ts';

const mockPrisma = {
  user: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService(mockPrisma as any);
  });

  describe('getAllUsers', () => {
    it('successfully returns all users', async () => {
      const mockUsers = [
        {
          userId: '1',
          email: 'test1@example.com',
          username: 'test1',
          hashPassword: 'hash',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: '2',
          email: 'test2@example.com',
          username: 'test2',
          hashPassword: 'hash',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPrisma.user.findMany.mockResolvedValue(mockUsers);
      const result = await service.getAllUsers();
      expect(result).toHaveLength(2);
      expect(result[0]).toBe(JSON.stringify(mockUsers[0], null, 2));
    });

    it('throws an error on database failure', async () => {
      mockPrisma.user.findMany.mockRejectedValue(new Error('Database error'));
      await expect(service.getAllUsers()).rejects.toThrow('Database error');
    });
  });

  describe('getUser', () => {
    it('successfully returns a user', async () => {
      const mockUser = {
        userId: '1',
        email: 'test@example.com',
        username: 'test',
        hashPassword: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.getUser({
        sub: '1',
        username: 'test',
        email: 'test@example',
      });
      expect(result).toBe(JSON.stringify(mockUser, null, 2));
    });

    it('throws NotFoundException if user is not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.getUser({
          sub: '999',
          username: 'test',
          email: 'test@example',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws an error on database failure', async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'));
      await expect(
        service.getUser({
          sub: '1',
          username: 'test',
          email: 'test@example',
        }),
      ).rejects.toThrow('Database error');
    });
  });

  describe('updateUser', () => {
    it('successfully updates a user', async () => {
      const mockUpdatedUser = {
        userId: '1',
        email: 'new@example.com',
        username: 'newname',
        hashPassword: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.user.update.mockResolvedValue(mockUpdatedUser);
      const result = await service.updateUser({
        jwtPayload: { sub: '1', username: 'newname', email: 'new@example.com' },
        email: 'new@example.com',
        username: 'newname',
      });
      expect(result).toBe(JSON.stringify(mockUpdatedUser, null, 2));
    });

    it('throws NotFoundException if user is not found', async () => {
      mockPrisma.user.update.mockRejectedValue(new Error('Record not found'));
      await expect(
        service.updateUser({
          jwtPayload: {
            sub: '999',
            username: 'newname',
            email: 'new@example.com',
          },
          email: 'new@example.com',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws an error on database failure', async () => {
      mockPrisma.user.update.mockRejectedValue(new Error('Database error'));
      await expect(
        service.updateUser({
          jwtPayload: {
            sub: '1',
            username: 'newname',
            email: 'new@example.com',
          },
          email: 'new@example.com',
        }),
      ).rejects.toThrow('Database error');
    });
  });
});
