import { Types } from "mongoose";
import { IEvent } from "../interfaces/Event.interface";
import EventModel from "../models/Event.model";
import { PaginationOptions } from "../interfaces/common/pagination.interface";
import { EventStatus } from "../constants/enum";

export class EventService {
  async create(eventData: IEvent) {
    // Check ticket ID
    if(eventData.ticketsId) {
      for (const ticketId of eventData.ticketsId) {
        if(!Types.ObjectId.isValid(ticketId.toString())) {
          throw new Error(`Ticket ID không hợp lệ: ${ticketId}`);
        }
      }
    }

    // Check event categories ID
    if(eventData.eventCategoriesId) {
      for (const eventCategory of eventData.eventCategoriesId) {
        if(!Types.ObjectId.isValid(eventCategory.toString())) {
          throw new Error(`Mã danh mục không hợp lệ: ${eventCategory}`);
        }
      }
    }

    const event = await EventModel.create(eventData);
    return event;
  }

  async update(eventId: string, eventData: IEvent) {
    if(Types.ObjectId.isValid(eventId.toString())) {
      throw new Error('ID sự kiện không hợp lệ');
    }

    if(eventData.startDate && eventData.endDate) {
      if (new Date(eventData.endDate) <= new Date(eventData.startDate)) {
        throw new Error('Thời gian kết thúc phải lớn hơn thời gian bắt đầu');
      }
    }

    // Check ticket ID
    if(eventData.ticketsId) {
      for (const ticketId of eventData.ticketsId) {
        if(!Types.ObjectId.isValid(ticketId.toString())) {
          throw new Error(`Ticket ID không hợp lệ: ${ticketId}`);
        }
      }
    }

    // Check event categories ID
    if(eventData.eventCategoriesId) {
      for (const eventCategory of eventData.eventCategoriesId) {
        if(!Types.ObjectId.isValid(eventCategory.toString())) {
          throw new Error(`Mã danh mục không hợp lệ: ${eventCategory}`);
        }
      }
    }

    const eventUpdated = await EventModel.findByIdAndUpdate(
      eventId,
      eventData,
      { new: true, runValidators: true }
    ).exec();

    if (!eventUpdated) {
      throw new Error('Không tìm thấy sự kiện để cập nhật');
    }

    return eventUpdated;
  }

  async delete(eventId: string) {
    if(Types.ObjectId.isValid(eventId.toString())) {
      throw new Error('ID sự kiện không hợp lệ');
    }

    const eventDeleted = await EventModel.findByIdAndDelete(eventId).exec();

    if(!eventDeleted) {
      throw new Error('Không tìm thấy sự kiện để xóa');
    }

    return eventDeleted;
  }

  async getEventById(eventId: string) {
    if(!Types.ObjectId.isValid(eventId)) {
      throw new Error('ID sự kiện không hợp lệ');
    }

    return EventModel.findById(eventId).exec();
  }

  async getEvents(options: PaginationOptions) {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IEvent;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };

    const [events, total] = await Promise.all([
      EventModel.find()
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
      EventModel.countDocuments()
    ]);

    return {
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async cancelEvent(eventId: string) {
    if(Types.ObjectId.isValid(eventId.toString())) {
      throw new Error('ID sự kiện không hợp lệ');
    }

    const eventCancelled = await EventModel.findByIdAndUpdate(
      eventId,
      { status: EventStatus.CANCELLED },
      { new: true, runValidators: true }
    ).exec();

    if (!eventCancelled) {
      throw new Error('Không tìm thấy sự kiện để cập nhật');
    }

    return eventCancelled;
  }

  async getEventsByCategories(categoryIds: string[], options: PaginationOptions) {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IEvent;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };

    const [events, total] = await Promise.all([
      EventModel.find({
        eventCategoriesId: {
          $in: categoryIds
        }
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
      EventModel.countDocuments()
    ]);

    return {
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getEventsByTickets(ticketIds: string[], options: PaginationOptions) {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IEvent;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };

    const [events, total] = await Promise.all([
      EventModel.find({
        ticketsId: {
          $in: ticketIds
        }
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
      EventModel.countDocuments()
    ]);

    return {
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }
};
