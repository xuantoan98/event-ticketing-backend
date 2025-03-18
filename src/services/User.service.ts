import User from "../models/User.model";
import { IUserCreate, IUserResponse, IUserDocument, IUserUpdate } from "../interfaces/User.interface";
import mongoose, { Types } from "mongoose";
import { PaginationOptions, PaginationResult } from "../interfaces/common/pagination.interface";

export class UserService {
  async createUser(userData: IUserCreate): Promise<IUserDocument> {
    const user = await User.create(userData);
    return user;
  }

  async findUserByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({email});
  }

  async getUserById(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }
    return User.findById(new mongoose.Schema.Types.ObjectId(userId));
  }

  async authenticate(
    email: string,
    password: string
  ): Promise<IUserDocument> {
    const user = await User.findOne({ email })
    if(!user) {
      throw new Error('Email không tồn tại');
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
      throw new Error('Mật khẩu không chính xác');
    }
    return user;
  }

  async updateUser(
    userId: string,
    updateData: Partial<IUserUpdate>
  ): Promise<IUserDocument> {
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('ID người dùng không đúng');
    }

    // Xóa các trường không được phép cập nhật
    delete updateData.role;
    delete updateData.email;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password') as IUserDocument

    return user;
  }

  async deleteUser(userId: string) {
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('ID người dùng không đúng');
    }

    const result = await User.findOneAndDelete({ _id: userId })
    return result;
  }

  async getPaginatedUsers(options: PaginationOptions): Promise<{
    data: IUserResponse[];
    pagination: PaginationResult
  }> {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IUserDocument;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };

    const [users, total] = await Promise.all([
      User.find()
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments()
    ]);

    return {
      data: users.map(user => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString()
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}