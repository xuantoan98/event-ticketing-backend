import { Types } from "mongoose";
import { IInvites } from "../interfaces/Invite.interface";
import InviteModel from "../models/Invite.model";
import { PaginationOptions } from "../interfaces/common/pagination.interface";

export class InviteService {
  async create(ivniteData: IInvites) {
    const inviteExit = await InviteModel.findOne({
      name: ivniteData.name,
      email: ivniteData.email
    });

    if(inviteExit) {
      throw new Error('Thông tin khách mời đã tồn tại');
    }

    const invite = InviteModel.create(ivniteData);
    return invite;
  }

  async update(inviteId: string, inviteData: IInvites) {
    if(!Types.ObjectId.isValid(inviteId)) {
      throw new Error('ID khách mời không đúng');
    }

    const invite = InviteModel.findByIdAndUpdate(
      inviteId,
      inviteData,
      { new: true, runValidators: true }
    ).exec();

    if(!invite) {
      throw new Error('Khách mời không tồn tại trong hệ thống');
    }
    return invite;
  }

  async delete(inviteId: string) {
    if(!Types.ObjectId.isValid(inviteId)) {
      throw new Error('ID khách mời không đúng');
    }

    // const result = await User.findOneAndDelete({ _id: userId })
    const result = await InviteModel.findOneAndUpdate({
      _id: inviteId,
      status: 0
    });

    return result;
  }

  async getAllInvites(options: PaginationOptions) {
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

  async getInviteById(inviteId: string) {
    if(!Types.ObjectId.isValid(inviteId)) {
      throw new Error('ID khách mời không đúng');
    }

    return InviteModel.findById(inviteId);
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
