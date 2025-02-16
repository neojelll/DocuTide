import {
  UserGetDto,
  ValidationUserUpdateDto,
  UserSignUpDto,
} from '@docu-tide/core/dtos';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userData: UserSignUpDto): Promise<string> {
    const existingUser = await this.userModel
      .findOne({
        $or: [{ username: userData.username }, { email: userData.email }],
      })
      .exec();

    if (existingUser) {
      throw new BadRequestException(
        'User with this username or email already exists.',
      );
    }

    const newUser = new this.userModel({
      ...userData,
      hashPassword: userData.password,
    });

    await newUser.save();
    return `User ${userData.username} created successfully.`;
  }
  async getAllUsers(): Promise<UserGetDto[]> {
    const users = await this.userModel.find().exec();
    return users.map(this.toUserGetDto);
  }

  async getUserByUserId(userId: string): Promise<UserGetDto> {
    const user = await this.userModel.findOne({ userId }).exec();
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return this.toUserGetDto(user);
  }

  async getUserByUsername(username: string): Promise<UserGetDto> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new Error(`User with username ${username} not found.`);
    }
    return this.toUserGetDto(user);
  }

  async updateUser(
    userId: string,
    data: ValidationUserUpdateDto,
  ): Promise<string> {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ userId }, data, { new: true })
      .exec();
    if (!updatedUser) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return `User with ID ${userId} updated successfully.`;
  }

  async deleteUser(userId: string): Promise<string> {
    const deletedUser = await this.userModel
      .findOneAndDelete({ userId })
      .exec();
    if (!deletedUser) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return `User with ID ${userId} deleted successfully.`;
  }

  private toUserGetDto(user: UserDocument): UserGetDto {
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
