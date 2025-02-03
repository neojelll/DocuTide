import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { User, UserDocument } from './schemas/user.schema';
import { UserSignUpDto } from '@lib/user/dto/user-sign-up.dto';
import { UserUpdateDto } from '@lib/user/dto/user-update.dto';
import { UserReadDto } from '@lib/user/dto/user-read.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userData: UserSignUpDto): Promise<UserReadDto> {
    const newUser = new this.userModel({ ...userData });
    return this.toUserReadDto(await newUser.save());
  }

  async getUserByUserId(userId: string): Promise<UserReadDto> {
    const user = await this.userModel.findOne({ userId });
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return this.toUserReadDto(user);
  }

  async getUserByUsername(username: string): Promise<UserReadDto> {
    console.log(`[getUserByUsername] Searching for user with username: ${username}`);
    const user = await this.userModel.findOne({ username });

    if (!user) {
      console.error(`[getUserByUsername] User with username ${username} not found.`);
      throw new Error(`User with username ${username} not found.`);
    }

    console.log(`[getUserByUsername] User found: ${JSON.stringify(user)}`);
    return this.toUserReadDto(user);
  }

  async updateUser(userId: string, updateDto: UserUpdateDto): Promise<UserReadDto> {
    const updatedUser = await this.userModel.findOneAndUpdate({ userId }, updateDto, { new: true });
    if (!updatedUser) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return this.toUserReadDto(updatedUser);
  }

  async deleteUser(userId: string): Promise<string> {
    const deletedUser = await this.userModel.findOneAndDelete({ userId });
    if (!deletedUser) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return `User with ID ${userId} deleted successfully.`;
  }

  private toUserReadDto(user: UserDocument): UserReadDto {
    console.log(`[toUserReadDto] Converting user document to UserReadDto`);
    const dto = plainToInstance(UserReadDto, user.toObject(), {
      excludeExtraneousValues: true,
    });
    console.log(`[toUserReadDto] Conversion result: ${JSON.stringify(dto)}`);
    return dto;
  }
}
