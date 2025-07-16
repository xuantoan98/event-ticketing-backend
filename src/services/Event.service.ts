import { Types } from "mongoose";
import { IEvent } from "../interfaces/Event.interface";
import EventModel from "../models/Event.model";
import { PaginationOptions } from "../interfaces/common/pagination.interface";
import { EventStatus } from "../constants/enum";
import { ApiError } from "../utils/ApiError";
import { HTTP } from "../constants/https";
import { AuthMessages, CommonMessages, EventMessages } from "../constants/messages";
import { IUserDocument } from "../interfaces/User.interface";

export class EventService {
  /**
   * Tạo mới sự kiện
   * @param eventData 
   * @returns 
   * 
   * new event object
   */
  async create(eventData: IEvent, currentUser?:IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    // Check ticket ID
    // if(eventData.ticketsId) {
    //   for (const ticketId of eventData.ticketsId) {
    //     if(!Types.ObjectId.isValid(ticketId.toString())) {
    //       throw new Error(`Ticket ID không hợp lệ: ${ticketId}`);
    //     }
    //   }
    // }

    // Check event categories ID
    if(eventData.eventCategoriesId) {
      for (const eventCategory of eventData.eventCategoriesId) {
        if(!Types.ObjectId.isValid(eventCategory.toString())) {
          throw new ApiError(HTTP.BAD_REQUEST, `${CommonMessages.ID_INVALID}: ${eventCategory}`);
        }
      }
    }

    const event = await EventModel.create(eventData);
    return event;
  }

  /**
   * Cập nhật sự kiện
   * @param eventId 
   * @param eventData 
   * @returns 
   * 
   * event updated
   */
  async update(eventId: string, eventData: IEvent, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if(Types.ObjectId.isValid(eventId.toString())) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    if(eventData.startDate && eventData.endDate) {
      if (new Date(eventData.endDate) <= new Date(eventData.startDate)) {
        throw new ApiError(HTTP.INTERNAL_ERROR, 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu');
      }
    }

    // Check ticket ID
    // if(eventData.ticketsId) {
    //   for (const ticketId of eventData.ticketsId) {
    //     if(!Types.ObjectId.isValid(ticketId.toString())) {
    //       throw new Error(`Ticket ID không hợp lệ: ${ticketId}`);
    //     }
    //   }
    // }

    // Check event categories ID
    if(eventData.eventCategoriesId) {
      for (const eventCategory of eventData.eventCategoriesId) {
        if(!Types.ObjectId.isValid(eventCategory.toString())) {
          throw new ApiError(HTTP.BAD_REQUEST, `${CommonMessages.ID_INVALID}: ${eventCategory}`);
        }
      }
    }

    const eventUpdated = await EventModel.findByIdAndUpdate(
      eventId,
      eventData,
      { new: true, runValidators: true }
    ).exec();

    if (!eventUpdated) {
      throw new ApiError(HTTP.NOT_FOUND, EventMessages.NOT_FOUND);
    }

    return eventUpdated;
  }

  async delete(eventId: string, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if(Types.ObjectId.isValid(eventId.toString())) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    // const eventDeleted = await EventModel.findByIdAndDelete(eventId).exec();
    const eventDeleted = await EventModel.findByIdAndUpdate(eventId, { status: EventStatus.CANCELLED });
    if(!eventDeleted) {
      throw new ApiError(HTTP.NOT_FOUND, EventMessages.NOT_FOUND);
    }

    return eventDeleted;
  }

  /**
   * Lấy thông tin sự kiện
   * @param eventId 
   * @param currentUser 
   * @returns 
   * 
   * Object event
   */
  async getEventById(eventId: string, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if(!Types.ObjectId.isValid(eventId)) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    const event = await EventModel.findById(eventId).exec();
    if (!event) {
      throw new ApiError(HTTP.NOT_FOUND, EventMessages.NOT_FOUND);
    }

    return event;
  }

  /**
   * Lấy danh sách sự kiện
   * @param query 
   * @param options 
   * @returns 
   * 
   * danh sách sự kiện
   */
  async getEvents(query: string, options: PaginationOptions) {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IEvent;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };

    let filter = {};
    if (query) {
      const searchRegex = new RegExp(query, 'i');
      filter = {
        $or: [
          { title: { $regex: searchRegex } }
        ]
      }
    }

    const [events, total] = await Promise.all([
      EventModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
      EventModel.countDocuments(filter)
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

  // async search(query: string, options: PaginationOptions) {
  //   const { page, limit, sortBy, sortOrder } = options;
  //   const skip = (page - 1) * limit;
  //   const sortField = sortBy as keyof IEvent;
  //   const sort: Record<string, 1 | -1> = {
  //     [sortField]: sortOrder === 'asc' ? 1 : -1
  //   };

  //   const searchRegex = new RegExp(query, 'i');
  //   const [events, total] = await Promise.all([
  //     EventModel.find({
  //       title: searchRegex
  //     })
  //     .sort(sort)
  //     .skip(skip)
  //     .limit(limit)
  //     .lean()
  //     .exec(),
  //     EventModel.countDocuments()
  //   ]);

  //   return {
  //     events,
  //     pagination: {
  //       total,
  //       page,
  //       limit,
  //       totalPages: Math.ceil(total / limit)
  //     }
  //   }
  // }

  /**
   * Hủy sự kiện
   * @param eventId 
   * @param currentUser 
   * @returns 
   * 
   * Sự kiện đã hủy
   */
  async cancelEvent(eventId: string, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if(Types.ObjectId.isValid(eventId.toString())) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    const eventCancelled = await EventModel.findByIdAndUpdate(
      eventId,
      { status: EventStatus.CANCELLED },
      { new: true, runValidators: true }
    ).exec();

    if (!eventCancelled) {
      throw new ApiError(HTTP.NOT_FOUND, EventMessages.NOT_FOUND);
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
