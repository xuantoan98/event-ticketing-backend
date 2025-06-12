import { Types } from "mongoose";
import { IEventCategories } from "../interfaces/EventCategories.interface";
import EventCategoriesModel from "../models/EventCategories.model";
import { PaginationOptions } from "../interfaces/common/pagination.interface";

export class EventCategoriesService {
  async create(eventCategoriesData: IEventCategories) {
    const eventCatExit = await EventCategoriesModel.findOne({
      name: eventCategoriesData.name
    });

    if(eventCatExit) {
      throw new Error('Danh mục sự kiện đã tồn tại');
    }

    const eventCat = EventCategoriesModel.create(eventCategoriesData);
    return eventCat;
  };

  async update(eventCatId: string, eventCatUpdate: IEventCategories) {
    if(!Types.ObjectId.isValid(eventCatId)) {
      throw new Error('ID danh mục sự kiện không đúng');
    }

    const eventCat = EventCategoriesModel.findByIdAndUpdate(
      eventCatId,
      eventCatUpdate,
      { new: true, runValidators: true }
    ).exec();

    if(!eventCat) {
      throw new Error('Danh mục sự kiện không tồn tại trong hệ thống');
    }
    return eventCat;
  };

  async delete(eventCatId: string) {
    if(!Types.ObjectId.isValid(eventCatId)) {
      throw new Error('ID danh mục sự kiện không đúng');
    }

    // const result = await User.findOneAndDelete({ _id: userId })
    const result = await EventCategoriesModel.findOneAndUpdate({
      _id: eventCatId,
      status: 0
    });

    return result;
  };

  async getEventCategoriesById(eventCatId: string) {
    if(!Types.ObjectId.isValid(eventCatId)) {
      throw new Error('ID danh mục sự kiện không đúng');
    }

    return EventCategoriesModel.findById(eventCatId);
  };

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
    ])

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
