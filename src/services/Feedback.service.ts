import { IFeedback } from "../interfaces/Feedback.interface";
import { EventService } from "./Event.service";
import Feedback from "../models/Feedback.model";
import { Types } from "mongoose";
import { PaginationOptions } from "../interfaces/common/pagination.interface";

const eventService = new EventService();

export class FeedbackService {
  async create(dataCreate: IFeedback) {
    if (dataCreate.eventId) {
      const eventExit = await eventService.getEventById(dataCreate.eventId.toString());
      if (!eventExit) {
        throw new Error('Sự kiện không tồn tại trong hệ thống');
      }
    }

    const result = await Feedback.create(dataCreate);
    return result;
  }

  async update(feedbackId: string, dataUpdate: IFeedback) {
    if (!Types.ObjectId.isValid(feedbackId)) {
      throw new Error('ID không hợp lệ');
    }

    const feedbackExit = await Feedback.findById(feedbackId);
    if (!feedbackExit) {
      throw new Error('Phản hồi không tồn tại trong hệ thống');
    }

    if (dataUpdate.eventId) {
      const eventExit = await eventService.getEventById(dataUpdate.eventId.toString());
      if (!eventExit) {
        throw new Error('Sự kiện không tồn tại trong hệ thống');
      }
    }

    const result = await Feedback.findByIdAndUpdate(feedbackId, dataUpdate);
    return result;
  }

  async delete(feedbackId: string) {
    if (!Types.ObjectId.isValid(feedbackId)) {
      throw new Error('ID không hợp lệ');
    }

    const feedbackExit = await Feedback.findById(feedbackId);
    if (!feedbackExit) {
      throw new Error('Phản hồi không tồn tại trong hệ thống');
    }

    const result = await Feedback.findByIdAndDelete(feedbackId);
    return result;
  }

  async getFeedback(feedbackId: string) {
    if (!Types.ObjectId.isValid(feedbackId)) {
      throw new Error('ID không hợp lệ');
    }

    const feedbackExit = await Feedback.findById(feedbackId);
    if (!feedbackExit) {
      throw new Error('Phản hồi không tồn tại trong hệ thống');
    }

    return await Feedback.findById(feedbackId);
  }

  async getFeedbacks(options: PaginationOptions) {
    const { page, limit, sortBy, sortOrder } = options;
    const skip = (page - 1) * limit;
    const sortField = sortBy as keyof IFeedback;
    const sort: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'asc' ? 1 : -1
    };

    const [feedbacks, total] = await Promise.all([
      Feedback.find()
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .lean()
      .exec(),
      Feedback.countDocuments()
    ]);

    return {
      feedbacks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }
}
