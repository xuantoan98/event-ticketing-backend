import { Types } from "mongoose";
import { IEventCost } from "../interfaces/EventCost.interface";
import EventCost from "../models/EventCost.model";
import { EventService } from "./Event.service";
import { PaginationOptions } from "../interfaces/common/pagination.interface";

const eventService = new EventService();

export class EventCostService {
  async create(dataCreate: IEventCost) {
    if (dataCreate.eventId) {
      const eventExit = await eventService.getEventById(dataCreate.eventId.toString());
      if (!eventExit) {
        throw new Error('Sự kiện không tồn tại trong hệ thống');
      }
    }

    const result = await EventCost.create(dataCreate);
    return result;
  }

  async update(eventCostId: string, dataUpdate: IEventCost) {
    if (!Types.ObjectId.isValid(eventCostId.toString())) {
      throw new Error('ID không hợp lệ');
    }

    if (dataUpdate.eventId) {
      const eventExit = await eventService.getEventById(dataUpdate.eventId.toString());
      if (!eventExit) {
        throw new Error('Sự kiện không tồn tại trong hệ thống');
      }
    }

    const result = await EventCost.findByIdAndUpdate(eventCostId, dataUpdate);
    return result;
  }

  async delete(eventCostId: string) {
    if (!Types.ObjectId.isValid(eventCostId.toString())) {
      throw new Error('ID không hợp lệ');
    }

    const result = await EventCost.findByIdAndDelete(eventCostId);
    return result;
  }

  async getEventCost(eventCostId: string) {
    if (!Types.ObjectId.isValid(eventCostId.toString())) {
      throw new Error('ID không hợp lệ');
    }

    const result = await EventCost.findById(eventCostId);
    if (!result) {
      throw new Error('Chi phí không tồn tại');
    }

    return result;
  }

  async getEventCosts(query: string, options: PaginationOptions) {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IEventCost;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };

    let filter = {};
    if (query) {
      const queryRegex = new RegExp(query, 'i');
      filter = {
        $or: [
          { 'events.title': { $regex: queryRegex } }
        ]
      }
    }

    const [eventCosts, total] = await Promise.all([
      EventCost.find(filter)
      .populate('events')
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .lean()
      .exec(),
      EventCost.countDocuments(filter)
    ]);

    return {
      eventCosts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }
}
