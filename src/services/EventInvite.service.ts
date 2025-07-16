import { Schema, Types } from "mongoose";
import { IEventInvite } from "../interfaces/EventInvite.invterface";
import EventInviteModel from "../models/EventInvite.model";
import { EventService } from "./Event.service";
import { InviteService } from "./Invite.service";
import { Status } from "../constants/enum";
import { PaginationOptions } from "../interfaces/common/pagination.interface";
import { ApiError } from "../utils/ApiError";
import { HTTP } from "../constants/https";
import { AuthMessages, CommonMessages, EventMessages, InviteMessages } from "../constants/messages";
import { IUserDocument } from "../interfaces/User.interface";

const eventService = new EventService();
const inviteService = new InviteService();

export class EventIniteService {
  /**
   * Tạo mới khách mời sự kiện
   * @param eventInviteData 
   * @returns 
   * 
   * new event invite
   */
  async create(eventInviteData: IEventInvite, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if (eventInviteData.eventId) {
      const eventExit = await eventService.getEventById(eventInviteData._id);
      if (!eventExit) {
        throw new ApiError(HTTP.NOT_FOUND, EventMessages.NOT_FOUND);
      }
    }

    if (eventInviteData.inviteId.length > 0) {
      for (const inviteId of eventInviteData.inviteId) {
        const inviteExit = await inviteService.getInviteById(inviteId.toString());
        if (!inviteExit) {
          throw new ApiError(HTTP.NOT_FOUND, `${InviteMessages.NOT_FOUND}: ${inviteId}`);
        }
      }
    }

    const eventInvite = await EventInviteModel.create(eventInviteData);
    return eventInvite;
  }

  /**
   * Cập nhật khách mời sự kiện
   * @param eventInviteId 
   * @param eventInviteUpdate 
   * @returns 
   * 
   * updated event invite
   */
  async update(eventInviteId: String, eventInviteUpdate: IEventInvite, currentUser?:IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if (Types.ObjectId.isValid(eventInviteId.toString())) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    if (eventInviteUpdate.eventId) {
      const eventExit = await eventService.getEventById(eventInviteUpdate._id);
      if (!eventExit) {
        throw new ApiError(HTTP.NOT_FOUND, EventMessages.NOT_FOUND);
      }
    }

    if (eventInviteUpdate.inviteId.length > 0) {
      for (const inviteId of eventInviteUpdate.inviteId) {
        const inviteExit = await inviteService.getInviteById(inviteId.toString());
        if (!inviteExit) {
          throw new ApiError(HTTP.NOT_FOUND, `${InviteMessages.NOT_FOUND}: ${inviteId}`);
        }
      }
    }

    const eventInvite = await EventInviteModel.findByIdAndUpdate(eventInviteId, eventInviteUpdate);
    return eventInvite;
  }

  /**
   * Xóa khách mời sự kiện
   * @param eventInviteId 
   * @returns 
   * 
   * thông báo
   */
  async delete(eventInviteId: String, currentUser?:IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if (Types.ObjectId.isValid(eventInviteId.toString())) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    const result = await EventInviteModel.findByIdAndUpdate(eventInviteId, { status: Status.INACTIVE });
    return result;
  }

  /**
   * Lấy danh sách
   * @param options 
   * @returns 
   * 
   * danh sách khách mời sự kiện
   */
  async getEventInvites(options: PaginationOptions) {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IEventInvite;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };

    const [eventInvites, total] = await Promise.all([
      EventInviteModel.find()
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      EventInviteModel.countDocuments()
    ]);

    return {
      eventInvites,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * Lấy thông tin chi tiết
   * @param eventInviteId 
   * @returns 
   * 
   * thông tin khách mời sự kiện
   */
  async getEventInvite(eventInviteId: String, currentUser?:IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }
    
    if (Types.ObjectId.isValid(eventInviteId.toString())) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    return await EventInviteModel.findById(eventInviteId);
  }
}
