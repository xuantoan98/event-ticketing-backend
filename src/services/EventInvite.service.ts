import { Schema, Types } from "mongoose";
import { IEventInvite } from "../interfaces/EventInvite.invterface";
import EventInviteModel from "../models/EventInvite.model";
import { EventService } from "./Event.service";
import { InviteService } from "./Invite.service";
import { Status } from "../constants/enum";
import { PaginationOptions } from "../interfaces/common/pagination.interface";

const eventService = new EventService();
const inviteService = new InviteService();

export class EventIniteService {
  async create(eventInviteData: IEventInvite) {
    if (eventInviteData.eventId) {
      const eventExit = await eventService.getEventById(eventInviteData._id);
      if (!eventExit) {
        throw new Error('Sụ kiện không tồn tại trong hệ thống');
      }
    }

    if (eventInviteData.inviteId.length > 0) {
      for (const inviteId of eventInviteData.inviteId) {
        const inviteExit = await inviteService.getInviteById(inviteId.toString());
        if (!inviteExit) {
          throw new Error(`Khách mời không tồn tại trong hệ thống: ${inviteId}`);
        }
      }
    }

    const eventInvite = EventInviteModel.create(eventInviteData);
    return eventInvite;
  }

  async update(eventInviteId: String, eventInviteUpdate: IEventInvite) {
    if (Types.ObjectId.isValid(eventInviteId.toString())) {
      throw new Error('ID không hợp lệ');
    }

    if (eventInviteUpdate.eventId) {
      const eventExit = await eventService.getEventById(eventInviteUpdate._id);
      if (!eventExit) {
        throw new Error('Sụ kiện không tồn tại trong hệ thống');
      }
    }

    if (eventInviteUpdate.inviteId.length > 0) {
      for (const inviteId of eventInviteUpdate.inviteId) {
        const inviteExit = await inviteService.getInviteById(inviteId.toString());
        if (!inviteExit) {
          throw new Error(`Khách mời không tồn tại trong hệ thống: ${inviteId}`);
        }
      }
    }

    const eventInvite = EventInviteModel.findByIdAndUpdate(eventInviteId, eventInviteUpdate);
    return eventInvite;
  }

  async delete(eventInviteId: String) {
    if (Types.ObjectId.isValid(eventInviteId.toString())) {
      throw new Error('ID không hợp lệ');
    }

    const result = await EventInviteModel.findByIdAndUpdate(eventInviteId, { status: Status.INACTIVE });
    return result;
  }

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

  async getEventInvite(eventInviteId: String) {
    if (Types.ObjectId.isValid(eventInviteId.toString())) {
      throw new Error('ID không hợp lệ');
    }

    return await EventInviteModel.findById(eventInviteId);
  }
}
