import { PipelineStage, Schema, Types } from "mongoose";
import { IEvent } from "../interfaces/Event.interface";
import EventModel from "../models/Event.model";
import { PaginationOptions } from "../interfaces/common/pagination.interface";
import { EventStatus, Role } from "../constants/enum";
import { ApiError } from "../utils/ApiError";
import { HTTP } from "../constants/https";
import { AuthMessages, CommonMessages, EventMessages } from "../constants/messages";
import { IUserDocument } from "../interfaces/User.interface";
import EventSupport from "../models/EventSupport.model";
import EventInvite from "../models/EventInvite.model";
import { nowUTC, toUTC } from "../utils/dateUtils";

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

    // Check event categories ID
    if(eventData.eventCategoriesId) {
      for (const eventCategory of eventData.eventCategoriesId) {
        if(!Types.ObjectId.isValid(eventCategory.toString())) {
          throw new ApiError(HTTP.BAD_REQUEST, `${CommonMessages.ID_INVALID}: ${eventCategory}`);
        }
      }
    }

    if (eventData.startDate) {
      eventData.startDate = toUTC(eventData.startDate);
    }

    if (eventData.endDate) {
      eventData.endDate = toUTC(eventData.endDate);
    }    

    const event = await EventModel.create(eventData);

    // Trường hợp có dữ liệu người hỗ trợ thì thêm vào bảng eventSupport
    if (eventData.supporters && eventData.supporters.length > 0) {
      const payloadSupportEvent = {
        eventId: event._id,
        userId: eventData.supporters,
        createdBy: currentUser._id
      } as {
        eventId: Schema.Types.ObjectId,
        userId: Schema.Types.ObjectId[],
        responsible?: String,
        note?: String
      };
      // thêm vào csdl
      await EventSupport.create(payloadSupportEvent);
    }

    // Trường hợp có dữ liệu khách mời thì thêm vào bảng eventInvite
    if (eventData.invites && eventData.invites.length > 0) {
      const payloadInviteEvent = {
        eventId: event._id,
        inviteId: eventData.invites,
        createdBy: currentUser._id
      } as {
        eventId: Schema.Types.ObjectId,
        inviteId: Schema.Types.ObjectId[]
      };
      // thêm vào csdl
      await EventInvite.create(payloadInviteEvent);
    }

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

    if(!Types.ObjectId.isValid(eventId.toString())) {      
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }    

    const eventExist = await EventModel.findById(eventId);
    if(!eventExist) {
      throw new ApiError(HTTP.NOT_FOUND, EventMessages.NOT_FOUND);
    }

    // Người dùng không tạo sự kiện thì không được sửa, nếu admin thì đc
    if (currentUser.role.toString() !== Role.ADMIN.toString() && eventExist.createdBy.toString() !== currentUser?._id.toString()) {
      throw new ApiError(HTTP.FORBIDDEN, 'Bạn không có quyền chỉnh sửa sự kiện này.');
    }

    if(eventData.startDate && eventData.endDate) {
      if (new Date(eventData.endDate).getTime() <= new Date(eventData.startDate).getTime()) {        
        throw new ApiError(HTTP.INTERNAL_ERROR, 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu');
      }
    }    

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
      eventData
    ).exec();

    const eventSupport = await EventSupport.findOne({ eventId: eventUpdated?._id });
    if (eventSupport) {      
      // trường hợp sửa sự kiện đã có thông tin người hỗ trợ -> cập nhật
      const payloadUpdate = {
        eventId: eventUpdated?._id,
        userId: eventData.supporters,
        updatedBy: currentUser._id
      };
      const result = await EventSupport.findByIdAndUpdate(eventSupport._id, payloadUpdate);
    } else {
      // trường hợp sửa sự kiện chưa có thông tin người hỗ trợ -> thêm mới
      const payloadCreate = {
        eventId: eventUpdated?._id,
        userId: eventData.supporters,
        createdBy: currentUser._id
      };

      const result = await EventSupport.create(payloadCreate);
    }

    const eventInvite = await EventInvite.findOne({ eventId: eventUpdated?._id });
    if (eventInvite) {      
      // trường hợp sửa sự kiện đã có thông tin khách mời -> cập nhật
      const payloadUpdate = {
        eventId: eventUpdated?._id,
        inviteId: eventData.invites,
        updatedBy: currentUser._id
      };
      const result = await EventInvite.findByIdAndUpdate(eventInvite._id, payloadUpdate);
    } else {
      // trường hợp sửa sự kiện chưa có thông tin người hỗ trợ -> thêm mới
      const payloadCreate = {
        eventId: eventUpdated?._id,
        inviteId: eventData.invites,
        updatedBy: currentUser._id
      };

      const result = await EventInvite.create(payloadCreate);
    }

    return eventUpdated;
  }

  /**
   * Xóa sự kiện
   * @param eventId 
   * @param currentUser 
   * @returns 
   * 
   * sự kiện updated
   */
  async delete(eventId: string, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if(!Types.ObjectId.isValid(eventId.toString())) {
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
  async getEvents(query: string, options: PaginationOptions & { startDate?: string; endDate?: string; eventCategory?: string }) {
    const { page, limit, sortBy, sortOrder, startDate, endDate, eventCategory } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IEvent;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };

    let filter: any = {};
    if (query) {
      const searchRegex = new RegExp(query, 'i');
      filter = {
        $or: [
          { title: { $regex: searchRegex } }
        ]
      }
    }

    // Lọc theo khoảng thời gian
    if (startDate || endDate) {
      filter.$and = [];

      if (startDate) {
        filter.$and.push({ endDate: { $gte: toUTC(startDate) } }); 
      }

      if (endDate) {
        filter.$and.push({ startDate: { $lte: toUTC(endDate) } }); 
      }
    }    

    // Lọc theo category (trường eventCategoriesId là mảng -> dùng $in)
    if (eventCategory) {
      filter.eventCategoriesId = { $in: [new Types.ObjectId(eventCategory)] };
    }    

    const pipeline: PipelineStage[] = [
      { $match: filter },
      {
        $lookup: {
          from: 'eventsupports',
          localField: '_id',
          foreignField: 'eventId',
          as: 'supports',
          pipeline: [
            {
              $project: {
                _id: 1,
                eventId: 1,
                userId: 1
              }
            }
          ]
        }
      },
      // Join user cho từng support
      {
        $unwind: { path: '$supports', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'eventinvites',
          localField: '_id',
          foreignField: 'eventId',
          as: 'invites',
          pipeline: [
            {
              $project: {
                _id: 1,
                eventId: 1,
                inviteId: 1
              }
            }
          ]
        }
      },
      // khách mời
      {
        $unwind: { path: '$invites', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'supports.userId',
          foreignField: '_id',
          as: 'supports.userInfo'
        }
      },
      {
        $addFields: {
          'supports.userInfo': {
            $map: {
              input: '$supports.userInfo',
              as: 'u',
              in: { _id: '$$u._id', name: '$$u.name' }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'eventcategories',
          localField: 'eventCategoriesId',
          foreignField: '_id',
          as: 'eventCategory',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'userCreated',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1
              }
            }
          ]
        }
      },
      {
        $unwind: { path: '$userCreated', preserveNullAndEmptyArrays: true }
      },
    ];

    // Thêm sort + pagination
    pipeline.push(
      { $sort: sort },
      { $skip: skip },
      { $limit: limit }
    );

    const [events, total] = await Promise.all([
      EventModel.aggregate(pipeline),
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
    
    if(!Types.ObjectId.isValid(eventId.toString())) {
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

  async updateEventStatus() {
    try {

      const currentTime = nowUTC();
      const eventsToUpdate = await EventModel.find({
        status: { $ne: EventStatus.CLOSED },
        endDate: { $lt: currentTime }
      });

      const eventsToUpdateInProcess = await EventModel.find({
        status: EventStatus.CREATE,
        startDate: { $lte: currentTime }
      });

      // Dành cho close sự kiện
      if (eventsToUpdate.length > 0) {
        await EventModel.updateMany(
          {
            _id: { $in: eventsToUpdate.map((event: IEvent) => event._id) }
          },
          {
            $set: { status: EventStatus.CLOSED }
          }
        );
        console.log(`Đã cập nhật trạng thái cho ${eventsToUpdate.length} sự kiện sang CLOSED.`); 
      }

      // Dành cho sự kiện đang diễn ra
      if (eventsToUpdateInProcess.length > 0) {
        await EventModel.updateMany(
          {
            _id: { $in: eventsToUpdateInProcess.map((event: IEvent) => event._id) }
          },
          {
            $set: { status: EventStatus.PROCESS }
          }
        );
        console.log(`Đã cập nhật trạng thái cho ${eventsToUpdateInProcess.length} sự kiện sang PROCESS.`); 
      }
    } catch (error) {
      throw new ApiError(HTTP.INTERNAL_ERROR, 'Lỗi khi cập nhật trạng thái sự kiện');
    }
  }

  async getMyEvents(currentuser: IUserDocument) {
    try {
      if (!currentuser) {
        throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
      }

      const result = await EventModel.find({
        createdBy: new Types.ObjectId(currentuser._id)
      }).sort({ createdAt: -1 }).exec();
      return result;
    } catch (error) {
      
    }
  }
};
