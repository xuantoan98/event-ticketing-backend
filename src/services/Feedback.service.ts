import { IFeedback } from "../interfaces/Feedback.interface";
import { EventService } from "./Event.service";
import Feedback from "../models/Feedback.model";
import { Types } from "mongoose";
import { PaginationOptions } from "../interfaces/common/pagination.interface";
import { IUserDocument } from "../interfaces/User.interface";
import { ApiError } from "../utils/ApiError";
import { HTTP } from "../constants/https";
import { AuthMessages, CommonMessages, EventMessages, FeedbackMessages } from "../constants/messages";
import { Role } from "../constants/enum";

const eventService = new EventService();

export class FeedbackService {
  /**
   * Service thêm mới phản hồi
   * @param dataCreate 
   * @param currentUser 
   * @returns 
   * 
   */
  async create(dataCreate: IFeedback, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if (dataCreate.eventId) {
      const eventExit = await eventService.getEventById(dataCreate.eventId.toString());
      if (!eventExit) {
        throw new ApiError(HTTP.NOT_FOUND, EventMessages.NOT_FOUND);
      }
    }

    const dataCreatedBy = {
      ...dataCreate,
      createdBy: new Types.ObjectId(currentUser._id),
    } as IFeedback;
    const result = await Feedback.create(dataCreatedBy);

    // Sau khi tạo phản hồi, cập nhập lại số lượng phản hồi vào field totalFeedbacks của sự kiện


    return result;
  }

  /**
   * Service cập nhật phản hồi
   * @param feedbackId 
   * @param dataUpdate 
   * @param currentUser 
   * @returns 
   * 
   */
  async update(feedbackId: string, dataUpdate: IFeedback, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if (!Types.ObjectId.isValid(feedbackId)) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    // Chỉ user là admin hoặc user tạo phản hồi mới có quyền sửa
    if (currentUser.role.toString() !== Role.ADMIN.toString() && dataUpdate.createdBy?.toString() !== currentUser._id.toString()) {
      throw new ApiError(HTTP.FORBIDDEN, AuthMessages.PERMISSION_DENIED);
    }

    const feedbackExit = await Feedback.findById(feedbackId);
    if (!feedbackExit) {
      throw new ApiError(HTTP.NOT_FOUND, FeedbackMessages.NOT_FOUND);
    }

    if (dataUpdate.eventId) {
      const eventExit = await eventService.getEventById(dataUpdate.eventId.toString());
      if (!eventExit) {
        throw new ApiError(HTTP.NOT_FOUND, EventMessages.NOT_FOUND);
      }
    }

    const result = await Feedback.findByIdAndUpdate(feedbackId, dataUpdate);
    return result;
  }

  /**
   * Service xóa phản hồi
   * @param feedbackId 
   * @param currentUser 
   * @returns 
   * 
   */
  async delete(feedbackId: string, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if (!Types.ObjectId.isValid(feedbackId)) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    // Admin có thể xóa phản hồi của user khác và chỉ user đó mới xóa được phản hồi của chính họ
    if (currentUser?.role.toString() !== Role.ADMIN.toString() && currentUser?._id.toString() !== feedbackId) {
      throw new ApiError(HTTP.FORBIDDEN, AuthMessages.PERMISSION_DENIED);
    }

    const feedbackExit = await Feedback.findById(feedbackId);
    if (!feedbackExit) {
      throw new ApiError(HTTP.NOT_FOUND, FeedbackMessages.NOT_FOUND);
    }

    const result = await Feedback.findByIdAndDelete(feedbackId);

    // Sau khi xóa phản hồi thành công, phải cập nhật lại số lượng phản hồi (totalFeedbacks) của event

    return result;
  }

  /**
   * Service lấy thông tin phản hồi
   * @param feedbackId 
   * @param currentUser 
   * @returns 
   * 
   */
  async getFeedback(feedbackId: string, currentUser?: IUserDocument) {
    if (!currentUser) {
      throw new ApiError(HTTP.UNAUTHORIZED, AuthMessages.UNAUTHORIZED);
    }

    if (!Types.ObjectId.isValid(feedbackId)) {
      throw new ApiError(HTTP.BAD_REQUEST, CommonMessages.ID_INVALID);
    }

    const feedbackExit = await Feedback.findById(feedbackId);
    if (!feedbackExit) {
      throw new ApiError(HTTP.NOT_FOUND, FeedbackMessages.NOT_FOUND);
    }

    return feedbackExit;
  }

  /**
   * Service lấy danh sách phản hồi
   * @param options 
   * @param currentUser 
   * @returns 
   * 
   */
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
