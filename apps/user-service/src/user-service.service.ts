import {
  UserReadDto,
  UserSignUpDto,
  UserUpdateDto,
} from '@docu-tide/user/lib/dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userData: UserSignUpDto): Promise<UserReadDto> {
    const newUser = new this.userModel({
      ...userData,
      hashPassword: userData.password,
    });
    return this.toUserReadDto(await newUser.save());
  }

  async getAllUsers(): Promise<UserReadDto[]> {
    const users = await this.userModel.find().exec();
    return users.map(this.toUserReadDto);
  }

  async getUserByUserId(userId: string): Promise<UserReadDto> {
    const user = await this.userModel.findOne({ userId: userId });
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return this.toUserReadDto(user);
  }

  async getUserByUsername(username: string): Promise<UserReadDto> {
    const user = await this.userModel.findOne({ username: username });
    if (!user) {
      throw new Error(`User with username ${username} not found.`);
    }
    return this.toUserReadDto(user);
  }

  async updateUser(userId: string, data: UserUpdateDto): Promise<UserReadDto> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { userId: userId },
      data,
    );

    if (!updatedUser) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return this.toUserReadDto(await this.userModel.findOne({ userId: userId }));
  }

  async deleteUser(userId: string): Promise<string> {
    const deletedUser = await this.userModel.findOneAndDelete({
      userId: userId,
    });
    if (!deletedUser) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return `User with ID ${userId} deleted successfully.`;
  }

  private toUserReadDto(user: UserDocument): UserReadDto {
    const plainUser = user.toObject();

    return {
      userId: plainUser.userId,
      email: plainUser.email,
      username: plainUser.username,
      role: plainUser.role,
      hashPassword: plainUser.hashPassword,
      createdAt: plainUser.createdAt,
      updatedAt: plainUser.updatedAt,
    };
  }
}
