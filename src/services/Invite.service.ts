import { Types } from "mongoose";
import { IInvites } from "../interfaces/Invite.interface";
import InviteModel from "../models/Invite.model";
import { PaginationOptions } from "../interfaces/common/pagination.interface";
import { IUserDocument } from "../interfaces/User.interface";
import { ApiError } from "../utils/ApiError";
import { AuthMessages, CommonMessages, InviteMessages } from "../constants/messages";
import { HTTP } from "../constants/https";
import { Role } from "../constants/enum";

export class InviteService {
  /**
   * Service thêm mới khách mời
   * @param ivniteData 
   * @param currentUser 
   * @returns 
   * 
   */
  async create(ivniteData: IInvites, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    const inviteExit = await InviteModel.findOne({
      name: ivniteData.name,
      email: ivniteData.email
    });

    if(inviteExit) {
      throw new ApiError(HTTP.CONFLICT, InviteMessages.INVITE_EXITS);
    }

    const invite = await InviteModel.create(ivniteData);
    return invite;
  }

  /**
   * Service cập nhật khách mời
   * @param inviteId 
   * @param inviteData 
   * @param currentUser 
   * @returns 
   * 
   */
  async update(inviteId: string, inviteData: IInvites, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    // Chỉ admin mới được cập nhật khách mời
    if (!currentUser.role || currentUser.role.toString() !== Role.ADMIN.toString()) {
      throw new ApiError(HTTP.FORBIDDEN, AuthMessages.PERMISSION_DENIED);
    }

    if(!Types.ObjectId.isValid(inviteId)) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    const inviteExit = await InviteModel.findById(inviteId);
    if(!inviteExit) {
      throw new ApiError(HTTP.NOT_FOUND, InviteMessages.NOT_FOUND);
    };

    const invite = await InviteModel.findByIdAndUpdate(
      inviteId,
      inviteData,
      { new: true, runValidators: true }
    ).exec();

    return invite;
  }

  /**
   * Service xóa khách mời
   * @param inviteId 
   * @param currentUser 
   * @returns 
   * 
   */
  async delete(inviteId: string, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    // Chỉ admin mới được xóa khách mời
    if (!currentUser.role || currentUser.role.toString() !== Role.ADMIN.toString()) {
      throw new ApiError(HTTP.FORBIDDEN, AuthMessages.PERMISSION_DENIED);
    }

    if(!Types.ObjectId.isValid(inviteId)) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    const inviteExit = await InviteModel.findById(inviteId);
    if(!inviteExit) {
      throw new ApiError(HTTP.NOT_FOUND, InviteMessages.NOT_FOUND);
    };

    // const result = await User.findOneAndDelete({ _id: userId })
    const result = await InviteModel.findByIdAndUpdate(inviteId, { status: 0 });

    return result;
  }

  /**
   * Service lấy danh sách khách mời
   * @param options 
   * @param currentUser 
   * @returns 
   * 
   */
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

  /**
   * Service lấy thông tin khách mời
   * @param inviteId 
   * @param currentUser 
   * @returns 
   * 
   */
  async getInviteById(inviteId: string, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if(!Types.ObjectId.isValid(inviteId)) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    const invite = await InviteModel.findById(inviteId);
    if(!invite) {
      throw new ApiError(HTTP.NOT_FOUND, InviteMessages.NOT_FOUND);
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
