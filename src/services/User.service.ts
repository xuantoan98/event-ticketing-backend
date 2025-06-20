import bcrypt from "bcrypt";
import User from "../models/User.model";
import { IUserCreate, IUserDocument } from "../interfaces/User.interface";
import mongoose, { Types } from "mongoose";
import { PaginationOptions } from "../interfaces/common/pagination.interface";
import Department from "../models/Department.model";
import { AuthMessages } from "../constants/messages";
import { Role } from "../constants/enum";
import { ApiError } from "../utils/ApiError";
import { HTTP } from "../constants/https";

require('dotenv').config();

export class UserService {
  async createUser(userData: IUserCreate, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    // Chỉ admin mới được tạo user có role ADMIN
    if (userData.role && userData.role.toString() == Role.ADMIN.toString() && ![Role.ADMIN.toString()].includes(currentUser.role)) {
      throw new ApiError(HTTP.FORBIDDEN, 'Bạn không có quyền tạo người dùng với vai trò này');
    }

    const userExist = await User.findOne({
      email: userData.email
    });

    if(userExist) {
      throw new ApiError(HTTP.CONFLICT, 'Người dùng đã tồn tại với email này');
    }

    if(userData.departmentId) {
      const checkDepartment = await Department.findById(userData.departmentId);
      if(!checkDepartment) throw new ApiError(HTTP.NOT_FOUND, 'Phòng ban không tồn tại');
    }

    const user = await User.create(userData);
    return user;
  }

  async findUserByEmail(email: string, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }
    
    return await User.findOne({email});
  }

  async getUserById(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ApiError(HTTP.BAD_REQUEST, 'ID người dùng không đúng');
    }

    return await User.findById(new mongoose.Types.ObjectId(userId));
  }

  async authenticate(email: string, password: string) {
    const user = await User.findOne({
      email: email,
      status: 1 
    }).select('+refreshTokens');

    if(!user) {
      throw new ApiError(HTTP.NOT_FOUND, 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa');
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
      throw new ApiError(HTTP.BAD_REQUEST, 'Mật khẩu không chính xác');
    }

    return user;
  }

  async updateUser(userId: string, updateData: IUserDocument, currentUser?: IUserDocument) {
    // Kiểm tra ID người dùng hợp lệ
    if(!Types.ObjectId.isValid(userId)) {
      throw new ApiError(HTTP.BAD_REQUEST, 'ID người dùng không đúng');
    }

    // Chỉ user có quyền admin hoặc chính người dùng đó mới có thể cập nhật thông tin
    if (!currentUser || (currentUser.role.toString() !== Role.ADMIN.toString() && currentUser._id.toString() !== userId.toString())) {
      throw new ApiError(HTTP.FORBIDDEN, 'Bạn không có quyền cập nhật thông tin người dùng này');
    }

    const allowedFields = [
      'name', 'dateOfBirth', 'address', 
      'gender', 'phone', 'avatar'
    ];

    const filererUpdate = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = (updateData as any)[key]
        return obj
      }, {} as any);

    if(updateData.departmentId) {
      const checkDepartment = await Department.findById(updateData.departmentId);
      if(!checkDepartment) throw new ApiError(HTTP.NOT_FOUND, 'Phòng ban không tồn tại');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      filererUpdate,
      { new: true, runValidators: true }
    ).select('-password') as IUserDocument;

    if (!user) throw new ApiError(HTTP.NOT_FOUND, 'User không tồn tại');

    return user;
  }

  async deleteUser(userId: string) {
    if(!Types.ObjectId.isValid(userId)) {
      throw new ApiError(HTTP.BAD_REQUEST, 'ID người dùng không đúng');
    }

    // const result = await User.findOneAndDelete({ _id: userId })
    const result = await User.findOneAndUpdate({
      _id: userId,
      status: 0
    });

    return result;
  }

  async getPaginatedUsers(query: string, options: PaginationOptions) {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IUserDocument;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };
    const searchRegex = new RegExp(query, 'i');
    const [users, total] = await Promise.all([
      User.find({
        $or: [
          { email: { $regex: searchRegex } },
          { name: { $regex: searchRegex } }
        ]
      })
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments({
        $or: [
          { email: { $regex: searchRegex } },
          { name: { $regex: searchRegex } }
        ]
      })
    ]);

    return {
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async searchUsers( query: string, options: PaginationOptions) {
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
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async changePassword(userId: string, password: string) {
    if(!Types.ObjectId.isValid(userId)) {
      throw new ApiError(HTTP.BAD_REQUEST, 'ID người dùng không đúng');
    }

    const userExist = await User.findById(userId).select('+refreshTokens');
    if (!userExist) throw new ApiError(HTTP.NOT_FOUND, 'Người dùng không tồn tại');

    const saltRounds = parseInt(process.env.SALT || '10', 10);
    const salt = await bcrypt.genSalt(saltRounds);
    const user = await User.findOneAndUpdate({
      _id: userId,
      password: await bcrypt.hash(password, salt),
      refreshTokens: [],
      passwordChangedAt: new Date()
    }).select('-password') as IUserDocument;

    return user;
  }
}
