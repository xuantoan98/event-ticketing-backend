import { PipelineStage, Types } from "mongoose";
import { IEventSupport } from "../interfaces/EventSupport.interface";
import EventSupport from "../models/EventSupport.model";
import User from "../models/User.model";
import { EventService } from "./Event.service";
import { Status } from "../constants/enum";
import { PaginationOptions } from "../interfaces/common/pagination.interface";
import { ApiError } from "../utils/ApiError";
import { HTTP } from "../constants/https";
import { AuthMessages, CommonMessages, EventMessages, UserMessages } from "../constants/messages";
import { IUserDocument } from "../interfaces/User.interface";

const eventService = new EventService();

export class EventSupportService {
  /**
   * Service thêm mới người hỗ trợ sự kiện
   * @param eventSupportCreate 
   * @param currentUser 
   * @returns 
   * 
   */
  async create(eventSupportCreate: IEventSupport, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if (eventSupportCreate.eventId) {
      const eventExit = await eventService.getEventById(eventSupportCreate.eventId.toString());
      if (!eventExit) {
        throw new ApiError(HTTP.NOT_FOUND, EventMessages.NOT_FOUND);
      }
    }

    if (eventSupportCreate.userId.length > 0) {
      for (const userId of eventSupportCreate.userId) {
        const userExit = await User.findById(userId);
        if (!userExit) {
          throw new ApiError(HTTP.NOT_FOUND, `${UserMessages.USER_NOT_FOUND}: ${userExit}`);
        }
      }
    }

    const result = await EventSupport.create(eventSupportCreate);
    // Tạo mới thành công thì sẽ gửi thông báo tới người hỗ trợ
    // Pending...

    return result;
  }

  /**
   * Service cập nhật thông tin người hỗ trợ sự kiện
   * @param eventSupportId 
   * @param eventSupportUpdate 
   * @param currentUser 
   * @returns 
   * 
   */
  async update(eventSupportId: String, eventSupportUpdate: IEventSupport, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if (!Types.ObjectId.isValid(eventSupportId.toString())) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    if (eventSupportUpdate.eventId) {
      const eventExit = await eventService.getEventById(eventSupportUpdate.eventId.toString());
      if (!eventExit) {
        throw new ApiError(HTTP.NOT_FOUND, EventMessages.NOT_FOUND);
      }
    }

    if (eventSupportUpdate.userId.length > 0) {
      for (const userId of eventSupportUpdate.userId) {
        const userExit = await User.findById(userId);
        if (!userExit) {
          throw new ApiError(HTTP.NOT_FOUND, `${UserMessages.USER_NOT_FOUND}: ${userExit}`);
        }
      }
    }

    const result = await EventSupport.findByIdAndUpdate(eventSupportId, eventSupportUpdate);
    // Cần thông báo tới người hỗ trợ mới nếu có
    // Pending...

    return result;
  }

  /**
   * Service xóa người hỗ trợ sự kiện
   * @param eventSupportId 
   * @returns 
   * 
   */
  async delete(eventSupportId: String, currentUser?:IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if (!Types.ObjectId.isValid(eventSupportId.toString())) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    const result = await EventSupport.findByIdAndUpdate(eventSupportId, { status: Status.INACTIVE });
    return result;
  }

  /**
   * Service lấy thông tin người hỗ trợ sự kiện
   * @param eventSupportId 
   * @returns 
   * 
   */
  async getEventSupport(eventSupportId: String, currentUser?:IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if (!Types.ObjectId.isValid(eventSupportId.toString())) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    return await EventSupport.findById(eventSupportId);
  }

  /**
   * Service danh sách hỗ trợ sự kiện
   * @param query 
   * @param options 
   * @returns 
   * 
   */
  async getEventSupports(query: string, options: PaginationOptions, currentUser?:IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }
    
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
