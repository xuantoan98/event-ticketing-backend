import { PipelineStage, Types } from "mongoose";
import { IEventSupport } from "../interfaces/EventSupport.interface";
import EventSupport from "../models/EventSupport.model";
import User from "../models/User.model";
import { EventService } from "./Event.service";
import { Status } from "../constants/enum";
import { PaginationOptions } from "../interfaces/common/pagination.interface";

const eventService = new EventService();

export class EventSupportService {
  async create(eventSupportCreate: IEventSupport) {
    if (eventSupportCreate.eventId) {
      const eventExit = await eventService.getEventById(eventSupportCreate.eventId.toString());
      if (!eventExit) {
        throw new Error('Sự kiện không tồn tại trong hệ thống');
      }
    }

    if (eventSupportCreate.userId.length > 0) {
      for (const userId of eventSupportCreate.userId) {
        const userExit = await User.findById(userId);
        if (!userExit) {
          throw new Error(`Người dùng không tồn tại trong hệ thống: ${userExit}`);
        }
      }
    }

    const result = await EventSupport.create(eventSupportCreate);
    return result;
  }

  async update(eventSupportId: String, eventSupportUpdate: IEventSupport) {
    if (!Types.ObjectId.isValid(eventSupportId.toString())) {
      throw new Error('ID không hợp lệ');
    }

    if (eventSupportUpdate.eventId) {
      const eventExit = await eventService.getEventById(eventSupportUpdate.eventId.toString());
      if (!eventExit) {
        throw new Error('Sự kiện không tồn tại trong hệ thống');
      }
    }

    if (eventSupportUpdate.userId.length > 0) {
      for (const userId of eventSupportUpdate.userId) {
        const userExit = await User.findById(userId);
        if (!userExit) {
          throw new Error(`Người dùng không tồn tại trong hệ thống: ${userExit}`);
        }
      }
    }

    const result = await EventSupport.findByIdAndUpdate(eventSupportId, eventSupportUpdate);
    return result;
  }

  async delete(eventSupportId: String) {
    if (!Types.ObjectId.isValid(eventSupportId.toString())) {
      throw new Error('ID không hợp lệ');
    }

    const result = await EventSupport.findByIdAndUpdate(eventSupportId, { status: Status.INACTIVE });
    return result;
  }

  async getEventSupport(eventSupportId: String) {
    if (!Types.ObjectId.isValid(eventSupportId.toString())) {
      throw new Error('ID không hợp lệ');
    }

    return await EventSupport.findById(eventSupportId);
  }

  async getEventSupports(query: string, options: PaginationOptions) {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IEventSupport;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };
    // const searchRegex = new RegExp(query, 'i');
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'users'
        }
      }
    ];

    // tìm kiếm theo tên người hỗ trợ
    if (query) {
      pipeline.push(
        {
          $match: {
            $expr: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: '$users',
                      as: 'user',
                      cond: {
                        $regexMatch: {
                          input: '$$user.name',
                          regex: 'query',
                          options: 'i'
                        }
                      }
                    }
                  }
                },
                0
              ]
            }
          }
        }
      );
    }

    // Thêm sort + pagination
    pipeline.push(
      { $sort: sort },
      { $skip: skip },
      { $limit: limit }
    );

    const [eventSupports, total] = await Promise.all([
      EventSupport.aggregate(pipeline),
      EventSupport.countDocuments(pipeline)
    ]);

    // const [eventSupports, total] = await Promise.all([
    //   EventSupport.find()
    //   .sort(sort)
    //   .limit(limit)
    //   .skip(skip)
    //   .lean()
    //   .exec(),
    //   EventSupport.countDocuments()
    // ]);

    return {
      eventSupports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }
}
