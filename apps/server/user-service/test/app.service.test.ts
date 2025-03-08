import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@docu-tide/core';
import { NotFoundException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '../src/app/app.service';

describe('UserService', () => {
  let service: UserService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      user: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('getAllUsers', () => {
    it('should return an array of stringified users when users exist', async () => {
      const mockUsers = [
        {
          userId: 'cuid12345678901234567890',
          email: 'alice@example.com',
          emailConfirmed: true,
          username: 'alice123',
          hashPassword:
            '$2b$10$hashedpassword123456789012345678901234567890123456789',
          biography: 'Loves coding and coffee',
          role: 'admin',
          notificationsEnabled: true,
          createdAt: new Date('2023-01-01T10:00:00Z'),
          updatedAt: new Date('2023-01-02T12:00:00Z'),
        },
        {
          userId: 'cuid22345678901234567890',
          email: 'bob@example.com',
          emailConfirmed: false,
          username: 'bobsmith',
          hashPassword:
            '$2b$10$hashedpassword223456789012345678901234567890123456789',
          biography: null,
          role: 'user',
          notificationsEnabled: false,
          createdAt: new Date('2023-02-01T14:30:00Z'),
          updatedAt: new Date('2023-02-01T14:30:00Z'),
        },
      ];
      prismaMock.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.getAllUsers();

      expect(result).toHaveLength(2);
      expect(typeof result[0]).toBe('string');
      expect(typeof result[1]).toBe('string');
      expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no users exist', async () => {
      prismaMock.user.findMany.mockResolvedValue([]);

      const result = await service.getAllUsers();

      expect(result).toEqual([]);
      expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when database throws an error', async () => {
      const error = new Error('Database error');
      prismaMock.user.findMany.mockRejectedValue(error);

      await expect(service.getAllUsers()).rejects.toThrow('Database error');
    });
  });

  describe('getUser', () => {
    it('should return the stringified user when user exists', async () => {
      const mockUser = {
        userId: 'cuid12345678901234567890',
        email: 'alice@example.com',
        emailConfirmed: true,
        username: 'alice123',
        hashPassword:
          '$2b$10$hashedpassword123456789012345678901234567890123456789',
        biography: 'Loves coding and coffee',
        role: 'admin',
        notificationsEnabled: true,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-02T12:00:00Z'),
      };
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      const jwtPayload = {
        sub: 'cuid12345678901234567890',
        username: 'alice123',
        email: 'alice@example.com',
      };

      const result = await service.getUser(jwtPayload);

      expect(typeof result).toBe('string');
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { userId: 'cuid12345678901234567890' },
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      const jwtPayload = {
        sub: 'cuid99999999999999999999',
        username: 'unknown',
        email: 'unknown@example.com',
      };

      await expect(service.getUser(jwtPayload)).rejects.toThrow(
        new NotFoundException(
          'User with ID "cuid99999999999999999999" not found.',
        ),
      );
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { userId: 'cuid99999999999999999999' },
      });
    });

    it('should throw an error when database throws an error', async () => {
      const error = new Error('Database error');
      prismaMock.user.findUnique.mockRejectedValue(error);
      const jwtPayload = {
        sub: 'cuid12345678901234567890',
        username: 'alice123',
        email: 'alice@example.com',
      };

      await expect(service.getUser(jwtPayload)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('updateUser', () => {
    it('should return the stringified updated user when user exists', async () => {
      const mockUpdatedUser = {
        userId: 'cuid12345678901234567890',
        email: 'alice_new@example.com',
        emailConfirmed: true,
        username: 'alice_new',
        hashPassword:
          '$2b$10$hashedpassword123456789012345678901234567890123456789',
        biography: 'Loves coding and coffee',
        role: 'admin',
        notificationsEnabled: true,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-02T12:00:00Z'),
      };
      prismaMock.user.update.mockResolvedValue(mockUpdatedUser);
      const userUpdateDto = {
        jwtPayload: {
          sub: 'cuid12345678901234567890',
          username: 'alice123',
          email: 'alice@example.com',
        },
        username: 'alice_new',
        email: 'alice_new@example.com',
      };

      const result = await service.updateUser(userUpdateDto);

      expect(typeof result).toBe('string');
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { userId: 'cuid12345678901234567890' },
        data: { username: 'alice_new', email: 'alice_new@example.com' },
      });
    });

    it('should handle empty update data', async () => {
      const mockUpdatedUser = {
        userId: 'cuid12345678901234567890',
        email: 'alice@example.com',
        emailConfirmed: true,
        username: 'alice123',
        hashPassword:
          '$2b$10$hashedpassword123456789012345678901234567890123456789',
        biography: 'Loves coding and coffee',
        role: 'admin',
        notificationsEnabled: true,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-02T12:00:00Z'),
      };
      prismaMock.user.update.mockResolvedValue(mockUpdatedUser);
      const userUpdateDto = {
        jwtPayload: {
          sub: 'cuid12345678901234567890',
          username: 'alice123',
          email: 'alice@example.com',
        },
      };

      const result = await service.updateUser(userUpdateDto);

      expect(typeof result).toBe('string');
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { userId: 'cuid12345678901234567890' },
        data: {},
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const error = { code: 'P2025' };
      prismaMock.user.update.mockRejectedValue(error);
      const userUpdateDto = {
        jwtPayload: {
          sub: 'cuid99999999999999999999',
          username: 'unknown',
          email: 'unknown@example.com',
        },
        username: 'newUsername',
      };

      await expect(service.updateUser(userUpdateDto)).rejects.toThrow(
        new NotFoundException(
          'User with ID "cuid99999999999999999999" not found.',
        ),
      );
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { userId: 'cuid99999999999999999999' },
        data: { username: 'newUsername' },
      });
    });

    it('should throw an error when database throws an error', async () => {
      const error = new Error('Database error');
      prismaMock.user.update.mockRejectedValue(error);
      const userUpdateDto = {
        jwtPayload: {
          sub: 'cuid12345678901234567890',
          username: 'alice123',
          email: 'alice@example.com',
        },
        username: 'alice_new',
      };

      await expect(service.updateUser(userUpdateDto)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
