import { Types } from "mongoose";
import { IEventCategories } from "../interfaces/EventCategories.interface";
import EventCategoriesModel from "../models/EventCategories.model";
import { PaginationOptions } from "../interfaces/common/pagination.interface";
import { ApiError } from "../utils/ApiError";
import { HTTP } from "../constants/https";
import { AuthMessages, CommonMessages, EventCategoriesMessages } from "../constants/messages";
import { IUserDocument } from "../interfaces/User.interface";

export class EventCategoriesService {
  /**
   * Service thêm mới dạn mục sự kiện
   * @param eventCategoriesData 
   * @param currentUser 
   * @returns 
   * 
   * new event category
   */
  async create(eventCategoriesData: IEventCategories, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    const eventCatExit = await EventCategoriesModel.findOne({
      name: eventCategoriesData.name
    });

    if(eventCatExit) {
      throw new ApiError(HTTP.CONFLICT, EventCategoriesMessages.EVENT_CATEGORY_EXIT);
    }

    const eventCat = await EventCategoriesModel.create(eventCategoriesData);
    return eventCat;
  };

  /**
   * Service cập nhật danh mục sự kiện
   * @param eventCatId 
   * @param eventCatUpdate 
   * @param currentUser 
   * @returns 
   * 
   * updated event category
   */
  async update(eventCatId: string, eventCatUpdate: IEventCategories, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if(!Types.ObjectId.isValid(eventCatId)) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    const eventCat = await EventCategoriesModel.findById(eventCatId.toString());
    if (!eventCat) {
      throw new ApiError(HTTP.NOT_FOUND, EventCategoriesMessages.NOT_FOUND);
    }

    const result = await EventCategoriesModel.findByIdAndUpdate(
      eventCatId,
      eventCatUpdate,
      { new: true, runValidators: true }
    ).exec();
    return result;
  };

  /**
   * Service xóa danh mục sự kiện
   * @param eventCatId 
   * @param currentUser 
   * @returns 
   * 
   * thông báo xóa 
   */
  async delete(eventCatId: string, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if(!Types.ObjectId.isValid(eventCatId)) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    const eventCatExit = await EventCategoriesModel.findById(eventCatId.toString());
    if (!eventCatExit) {
      throw new ApiError(HTTP.NOT_FOUND, EventCategoriesMessages.NOT_FOUND);
    }

    // const result = await User.findOneAndDelete({ _id: userId })
    const result = await EventCategoriesModel.findByIdAndUpdate(eventCatId, { status: 0 });

    return result;
  };

  /**
   * Service lấy thông tin danh mục sự kiện
   * @param eventCatId 
   * @returns 
   * 
   * object event category
   */
  async getEventCategoriesById(eventCatId: string) {
    if(!Types.ObjectId.isValid(eventCatId)) {
      throw new ApiError(HTTP.BAD_REQUEST, 'ID danh mục sự kiện không đúng');
    }

    const eventCat = await EventCategoriesModel.findById(eventCatId);
    if(!eventCat) {
      throw new ApiError(HTTP.NOT_FOUND, EventCategoriesMessages.NOT_FOUND);
    }

    return eventCat;
  };

  /**
   * Service lấy danh sách danh mục sự kiện
   * @param query 
   * @param options 
   * @returns 
   * 
   * List event category
   */
  async getEventCategories(query: string, options: PaginationOptions) {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IEventCategories;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };
    let filter = {};
    if (query) {
      const searchRegex = new RegExp(query, 'i');
      filter = { name: { $regex: searchRegex } }
    }

    const [eventCats, total] = await Promise.all([
      EventCategoriesModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      EventCategoriesModel.countDocuments(filter)
    ]);

    return {
      eventCats,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  };

  // async search(query: string, options: PaginationOptions) {
  //   const { page, limit, sortBy, sortOrder } = options;
  //   const skip = (page - 1) * limit;
  //   const sortField = sortBy as keyof IEventCategories;
  //   const sort: Record<string, 1 | -1> = {
  //     [sortField]: sortOrder === 'asc' ? 1 : -1
  //   };
  //   const searchRegex = new RegExp(query, 'i');

  //   const [eventCats, total] = await Promise.all([
  //     EventCategoriesModel.find({
  //       $or: [
  //         { name: { $regex: searchRegex } }
  //       ]})
  //       .sort(sort)
  //       .skip(skip)
  //       .limit(limit)
  //       .lean(),
  //     EventCategoriesModel.countDocuments({
  //       $or: [
  //         { name: { $regex: searchRegex } }
  //       ]
  //     })
  //   ])

  //   return {
  //     eventCats,
  //     pagination: {
  //       total,
  //       page,
  //       limit,
  //       totalPages: Math.ceil(total / limit)
  //     }
  //   }
  // };
}
