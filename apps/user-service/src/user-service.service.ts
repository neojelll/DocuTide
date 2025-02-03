import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { UserSignUpDto } from '@lib/user/dto/user-sign-up.dto';
import { UserUpdateDto } from '@lib/user/dto/user-update-dto';
import { UserReadDto } from '@lib/user/dto/user-read.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userData: UserSignUpDto): Promise<UserReadDto> {
    const newUser = new this.userModel({ ...userData });
    const savedUser = await newUser.save();
    return this.toUserReadDto(savedUser);
  }

  async login(username: string, password: string): Promise<UserReadDto> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }
    return this.toUserReadDto(user);
  }


  async getUserByUserId(userId: string): Promise<UserReadDto> {
    const user = await this.userModel.findOne({ userId });
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }
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
    const { hashPassword, ...data } = user.toObject();
    const dto = new UserReadDto();
    Object.assign(dto, data);
    dto.hashPassword = hashPassword;
    return dto;
  }
}
