import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../src/app/app.controller';
import { UserService } from '../src/app/app.service';
import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, it } from 'node:test';
import { JwtPayload } from '@docu-tide/core/auth';
import { UserSignInDto } from '@docu-tide/core/dtos';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    getUserByUsername: jest.fn(),
    getAllUsers: jest.fn(),
    getUserByUserId: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('handleLogin', () => {
    it('should return user data when username exists', async () => {
      const dto: UserSignInDto = { username: 'testUser' };
      mockUserService.getUserByUsername.mockResolvedValue('user-data');
      expect(await controller.handleLogin(dto)).toBe('user-data');
    });

    it('should throw NotFoundException when username does not exist', async () => {
      mockUserService.getUserByUsername.mockRejectedValue(
        new NotFoundException(),
      );
      await expect(
        controller.handleLogin({ username: 'unknown' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle empty username', async () => {
      await expect(controller.handleLogin({ username: '' })).rejects.toThrow();
    });
  });

  describe('handleGetAll', () => {
    it('should return all users', async () => {
      mockUserService.getAllUsers.mockResolvedValue(['user1', 'user2']);
      expect(await controller.handleGetAll()).toEqual(['user1', 'user2']);
    });

    it('should return empty array if no users found', async () => {
      mockUserService.getAllUsers.mockResolvedValue([]);
      expect(await controller.handleGetAll()).toEqual([]);
    });
  });

  describe('handleGet', () => {
    it('should return user data by userId', async () => {
      const payload: JwtPayload = { sub: 'user-id' };
      mockUserService.getUserByUserId.mockResolvedValue('user-data');
      expect(await controller.handleGet(payload)).toBe('user-data');
    });

    it('should throw NotFoundException for invalid userId', async () => {
      mockUserService.getUserByUserId.mockRejectedValue(
        new NotFoundException(),
      );
      await expect(controller.handleGet({ sub: 'invalid-id' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle empty userId', async () => {
      await expect(controller.handleGet({ sub: '' })).rejects.toThrow();
    });
  });

  describe('handleUpdate', () => {
    it('should update user data successfully', async () => {
      const dto: UserUpdateDto = {
        jwtPayload: { sub: 'user-id' },
        bio: 'updated bio',
      };
      mockUserService.updateUser.mockResolvedValue('updated-user-data');
      expect(await controller.handleUpdate(dto)).toBe('updated-user-data');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserService.updateUser.mockRejectedValue(new NotFoundException());
      await expect(
        controller.handleUpdate({
          jwtPayload: { sub: 'invalid-id' },
          bio: 'bio',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle update with empty fields', async () => {
      const dto: UserUpdateDto = { jwtPayload: { sub: 'user-id' } };
      mockUserService.updateUser.mockResolvedValue('updated-user-data');
      expect(await controller.handleUpdate(dto)).toBe('updated-user-data');
    });

    it('should handle missing jwtPayload', async () => {
      const dto: any = { bio: 'bio' };
      await expect(controller.handleUpdate(dto)).rejects.toThrow();
    });
  });
});
