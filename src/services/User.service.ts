import User from "../models/User.model";
import { IUserResponse, IUserDocument } from "../interfaces/User.interface";
import mongoose, { Types } from "mongoose";
import { PaginationOptions, PaginationResult } from "../interfaces/common/pagination.interface";

export class UserService {
  async createUser(userData: IUserDocument): Promise<IUserDocument> {
    const userExist = await User.findOne({
      email: userData.email
    })

    if(userExist) {
      throw new Error('Email đã tồn tại')
    }

    const user = await User.create(userData)
    return user
  }

  async findUserByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({email})
  }

  async getUserById(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('ID người dùng không đúng')
    }

    const objectId = new mongoose.Types.ObjectId(userId)
    return User.findById(objectId)
  }

  async authenticate(
    email: string,
    password: string
  ): Promise<IUserDocument> {
    const user = await User.findOne({
      email: email,
      status: 1 
    })

    if(!user) {
      throw new Error('Tài khoản không tồn tại hoặc đã bị vô hiệu hóa')
    }

    const isMatch = await user.comparePassword(password)
    if(!isMatch) {
      throw new Error('Mật khẩu không chính xác')
    }
    return user
  }

  async updateUser(
    userId: string,
    updateData: IUserDocument
  ) {
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('ID người dùng không đúng')
    }

    const allowedFields = [
      'name', 'dateOfBirth', 'address', 
      'gender', 'phone', 'avatar'
    ]

    const filererUpdate = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = (updateData as any)[key]
        return obj
      }, {} as any)

    const user = await User.findByIdAndUpdate(
      userId,
      filererUpdate,
      { new: true, runValidators: true }
    ).select('-password') as IUserDocument

    if (!user) throw new Error('User không tồn tại')
    return user
  }

  async deleteUser(userId: string) {
    if(!Types.ObjectId.isValid(userId)) {
      throw new Error('ID người dùng không đúng')
    }

    // const result = await User.findOneAndDelete({ _id: userId })
    const result = await User.findOneAndUpdate({
      _id: userId,
      status: 0
    })
    return result
  }

  async getPaginatedUsers(options: PaginationOptions): Promise<{
    data: IUserResponse[];
    pagination: PaginationResult
  }> {
    const { page, limit, sortBy, sortOrder } = options
    const skip = (page - 1) * limit
    const sortField = sortBy as keyof IUserDocument
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
    ])

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
    }
  }

  async searchUsers(
    query: string,
    options: PaginationOptions
  ): Promise<{
    data: IUserResponse[];
    pagination: PaginationResult;
  }> {
    const { page = 1, limit = 10 } = options
    const skip = (page - 1) * limit
    const searchRegex = new RegExp(query, 'i')
    const [users, total] = await Promise.all([
      User.find({
        $or: [
          { email: { $regex: searchRegex } },
          { name: { $regex: searchRegex } }
        ]
      })
      .select('-password')
      .skip(skip)
      .limit(limit)
      .lean(),

      User.countDocuments({
        $or: [
          { email: { $regex: searchRegex } },
          { name: { $regex: searchRegex } }
        ]
      })
    ])

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
    }
  }
}