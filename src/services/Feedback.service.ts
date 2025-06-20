import { IFeedback } from "../interfaces/Feedback.interface";
import { EventService } from "./Event.service";
import Feedback from "../models/Feedback.model";
import { Types } from "mongoose";
import { PaginationOptions } from "../interfaces/common/pagination.interface";
import { IUserDocument } from "../interfaces/User.interface";
import { ApiError } from "../utils/ApiError";
import { HTTP } from "../constants/https";
import { AuthMessages } from "../constants/messages";
import { Role } from "../constants/enum";

const eventService = new EventService();

export class FeedbackService {
  async create(dataCreate: IFeedback, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if (dataCreate.eventId) {
      const eventExit = await eventService.getEventById(dataCreate.eventId.toString());
      if (!eventExit) {
        throw new ApiError(HTTP.NOT_FOUND, 'Sự kiện không tồn tại trong hệ thống');
      }
    }

    const dataCreatedBy = {
      ...dataCreate,
      createdBy: new Types.ObjectId(currentUser._id),
    } as IFeedback;
    const result = await Feedback.create(dataCreatedBy);

    // Sau khi tạo phản hồi, cập nhập lại số lượng phản hồi vào filed totalFeedbacks của sự kiện


    return result;
  }

  async update(feedbackId: string, dataUpdate: IFeedback, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if (!Types.ObjectId.isValid(feedbackId)) {
      throw new ApiError(HTTP.BAD_REQUEST, 'ID không hợp lệ');
    }

    // Chỉ user là admin hoặc user tạo phản hồi mới có quyền sửa
    if (currentUser.role.toString() !== Role.ADMIN.toString() && dataUpdate.createdBy?.toString() !== currentUser._id.toString()) {
      throw new ApiError(HTTP.FORBIDDEN, 'Bạn không có quyền sửa phản hồi này');
    }

    const feedbackExit = await Feedback.findById(feedbackId);
    if (!feedbackExit) {
      throw new ApiError(HTTP.NOT_FOUND, 'Phản hồi không tồn tại trong hệ thống');
    }

    if (dataUpdate.eventId) {
      const eventExit = await eventService.getEventById(dataUpdate.eventId.toString());
      if (!eventExit) {
        throw new ApiError(HTTP.NOT_FOUND, 'Sự kiện không tồn tại trong hệ thống');
      }
    }

    const result = await Feedback.findByIdAndUpdate(feedbackId, dataUpdate);
    return result;
  }

  async delete(feedbackId: string, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if (!Types.ObjectId.isValid(feedbackId)) {
      throw new ApiError(HTTP.BAD_REQUEST, 'ID không hợp lệ');
    }

    // Admin có thể xóa phản hồi của user khác và chỉ user đó mới xóa được phản hồi của chính họ
    if (currentUser?.role.toString() !== Role.ADMIN.toString() && currentUser?._id.toString() !== feedbackId) {
      throw new ApiError(HTTP.FORBIDDEN, 'Bạn không có quyền xóa phản hồi này');
    }

    const feedbackExit = await Feedback.findById(feedbackId);
    if (!feedbackExit) {
      throw new ApiError(HTTP.NOT_FOUND, 'Phản hồi không tồn tại trong hệ thống');
    }

    const result = await Feedback.findByIdAndDelete(feedbackId);
    return result;
  }

  async getFeedback(feedbackId: string, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if (!Types.ObjectId.isValid(feedbackId)) {
      throw new ApiError(HTTP.BAD_REQUEST, 'ID không hợp lệ');
    }

    const feedbackExit = await Feedback.findById(feedbackId);
    if (!feedbackExit) {
      throw new ApiError(HTTP.NOT_FOUND, 'Phản hồi không tồn tại trong hệ thống');
    }

    return feedbackExit;
  }

  async getFeedbacks(options: PaginationOptions, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

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
