import { Types } from "mongoose";
import { PaginationOptions } from "../interfaces/common/pagination.interface";
import { IEventDetail } from "../interfaces/EventDetail.interface";
import EventModel from "../models/Event.model";
import EventDetailModel from "../models/EventDetail.model";
import { Status } from "../constants/enum";

export class EventDetailService {
  async create(dataCreate: IEventDetail) {
    if (dataCreate.eventId) {
      const eventExit = await EventModel.findById(dataCreate.eventId);
      if (!eventExit) {
        throw new Error('Sự kiện không tồn tại');
      }
    }

    const result = await EventDetailModel.create(dataCreate);
    return result;
  };

  async update(eventDetailId: string, dataUpdate: IEventDetail) {
    if (!eventDetailId || !Types.ObjectId.isValid(eventDetailId.toString())) {
      throw new Error('Mã chi tiết sự kiện không hợp lệ');
    }

    if (eventDetailId) {
      const eventDetailExit = await EventDetailModel.findById(eventDetailId);
      if (!eventDetailExit) {
        throw new Error('Chi tiết sự kiện không tồn tại');
      }
    }

    if (dataUpdate.eventId) {
      const eventExit = await EventModel.findById(dataUpdate.eventId);
      if (!eventExit) {
        throw new Error('Sự kiện không tồn tại');
      }
    }

    const result = await EventDetailModel.findByIdAndUpdate(eventDetailId, dataUpdate);
    return result;
  };

  async delete(eventDetailId: string) {
    if(!Types.ObjectId.isValid(eventDetailId.toString())) {
      throw new Error('Mã chi tiết sự kiện không hợp lệ');
    }

    // const result = await User.findOneAndDelete({ _id: userId })
    const result = await EventDetailModel.findByIdAndUpdate(eventDetailId, { status: Status.INACTIVE });

    return result;
  };

  async getEventDetail(eventDetailId: string) {
    if(!Types.ObjectId.isValid(eventDetailId.toString())) {
      throw new Error('Mã chi tiết sự kiện không hợp lệ');
    }

    const result = await EventDetailModel.findById(eventDetailId);
    if (!result) {
      throw new Error('Chi tiết sự kiện không tồn tại');
    }

    return result;
  };

  async getEventDetails(query: string, options: PaginationOptions) {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IEventDetail;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };
    const queryRegex = new RegExp(query, 'i');
    const [eventDetails, total] = await Promise.all([
      EventDetailModel.find({
        $or: [{
          'events.title': { $regex: queryRegex }
        }]
      }).populate('events')
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .lean()
      .exec(),
      EventDetailModel.countDocuments()
    ]);

    return {
      eventDetails,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  };
}
