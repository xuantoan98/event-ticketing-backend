import { Types } from "mongoose";
import { IInvites } from "../interfaces/Invite.interface";
import InviteModel from "../models/Invite.model";
import { PaginationOptions } from "../interfaces/common/pagination.interface";
import { IUserDocument } from "../interfaces/User.interface";
import { ApiError } from "../utils/ApiError";
import { AuthMessages } from "../constants/messages";
import { HTTP } from "../constants/https";
import { Role } from "../constants/enum";

export class InviteService {
  async create(ivniteData: IInvites, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    const inviteExit = await InviteModel.findOne({
      name: ivniteData.name,
      email: ivniteData.email
    });

    if(inviteExit) {
      throw new ApiError(HTTP.CONFLICT, 'Thông tin khách mời đã tồn tại');
    }

    const invite = await InviteModel.create(ivniteData);
    return invite;
  }

  async update(inviteId: string, inviteData: IInvites, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    // Chỉ admin mới được cập nhật khách mời
    if (!currentUser.role || currentUser.role.toString() !== Role.ADMIN.toString()) {
      throw new ApiError(HTTP.FORBIDDEN, 'Bạn không có quyền cập nhật khách mời với vai trò này');
    }

    if(!Types.ObjectId.isValid(inviteId)) {
      throw new ApiError(HTTP.BAD_REQUEST, 'ID khách mời không đúng');
    }

    const invite = await InviteModel.findByIdAndUpdate(
      inviteId,
      inviteData,
      { new: true, runValidators: true }
    ).exec();

    if(!invite) {
      throw new ApiError(HTTP.NOT_FOUND, 'Khách mời không tồn tại trong hệ thống');
    }

    return invite;
  }

  async delete(inviteId: string, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    // Chỉ admin mới được xóa khách mời
    if (!currentUser.role || currentUser.role.toString() !== Role.ADMIN.toString()) {
      throw new ApiError(HTTP.FORBIDDEN, 'Bạn không có quyền xóa khách mời với vai trò này');
    }

    if(!Types.ObjectId.isValid(inviteId)) {
      throw new ApiError(HTTP.BAD_REQUEST, 'ID khách mời không đúng');
    }

    const inviteExit = await InviteModel.findById(inviteId);
    if(!inviteExit) {
      throw new ApiError(HTTP.NOT_FOUND, 'Khách mời không tồn tại');
    };

    // const result = await User.findOneAndDelete({ _id: userId })
    const result = await InviteModel.findOneAndUpdate({
      _id: inviteId,
      status: 0
    });

    return result;
  }

  async getAllInvites(options: PaginationOptions, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IInvites;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };

    const [invites, total] = await Promise.all([
      InviteModel.find()
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      InviteModel.countDocuments()
    ]);

    return {
      invites,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getInviteById(inviteId: string, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if(!Types.ObjectId.isValid(inviteId)) {
      throw new Error('ID khách mời không đúng');
    }

    const invite = await InviteModel.findById(inviteId);
    if(!invite) {
      throw new ApiError(HTTP.NOT_FOUND, 'Khách mời không tồn tại');
    };

    return invite;
  }

  async search(query: string, options: PaginationOptions) {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IInvites;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };
    const searchRegex = new RegExp(query, 'i');

    const [invites, total] = await Promise.all([
      InviteModel.find({
        $or: [
          { email: { $regex: searchRegex } },
          { name: { $regex: searchRegex } }
        ]})
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      InviteModel.countDocuments({
        $or: [
          { email: { $regex: searchRegex } },
          { name: { $regex: searchRegex } }
        ]
      })
    ])

    return {
      invites,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }
}
