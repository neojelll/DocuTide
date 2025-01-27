import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from '../service/user-service.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { UserPostgres } from '../entities/user-postgres.entity';

describe('UserServiceController', () => {
  let controller: UserServiceController;
  let service: UserServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserServiceController],
      providers: [
        {
          provide: UserServiceService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserServiceController>(UserServiceController);
    service = module.get<UserServiceService>(UserServiceService);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password',
      };

      const result = { id: '1', ...createUserDto };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createUserDto)).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = '1';
      const result = {
        id: userId,
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password',
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(userId)).toEqual(result);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'nonexistent-id';
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { username: 'updateduser' };

      const result: UserPostgres = {
        id: userId,
        username: 'updateduser',
        email: 'testuser@example.com',
        password: 'password',
      };

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(userId, updateUserDto)).toEqual(result);
    });
  });
  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = '1';
      const result = { message: `User ${userId} deleted` };
      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove(userId)).toEqual(result);
    });
  });
});
