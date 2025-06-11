import { Request, Response } from "express"
import { formatResponse } from "../utils/response.util";
import { IFeedback } from "../interfaces/Feedback.interface";
import { FeedbackService } from "../services";
import { AuthMessages, FeedbackMessages } from "../constants/messages";

const feedbackService = new FeedbackService();

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const dataCreate = {
      ...req.body,
      createdBy: req.user?._id
    } as IFeedback;

    const result = await feedbackService.create(dataCreate);
    return res.status(201).json(
      formatResponse(
        'success',
        FeedbackMessages.CREATE_SUCCESSFULLY,
        result
      )
    );
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}

export const updateFeedback = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const feedback = await feedbackService.getFeedback(req.params.id);

    // Admin có thể sửa phản hồi của user khác và chỉ user đó mới sửa được phản hồi của chính họ
    if (user?.role !== 'admin' && feedback?.createdBy.toString() !== user?._id.toString()) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.FORBIDDEN
        )
      )
    }

    const dataUpdate = {
      ...req.body,
      updatedBy: req.user?._id
    } as IFeedback;

    const result = await feedbackService.update(req.params.id, dataUpdate);
    return res.status(200).json(
      formatResponse(
        'success',
        FeedbackMessages.UPDATE_SUCCESSFULLY,
        result
      )
    );
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const feedback = await feedbackService.getFeedback(req.params.id);

    // Admin có thể xóa phản hồi của user khác và chỉ user đó mới xóa được phản hồi của chính họ
    if (user?.role !== 'admin' && feedback?.createdBy.toString() !== user?._id.toString()) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.FORBIDDEN
        )
      )
    }

    const result = await feedbackService.delete(req.params.id);
    return result;
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}

export const getFeedback = async (req: Request, res: Response) => {
  try {
    const result = await feedbackService.getFeedback(req.params.id.toString())
    if(!result) {
      return res.status(404).json(
        formatResponse(
          'error',
          FeedbackMessages.NOT_FOUND
        )
      );
    };

    return res.status(200).json(formatResponse(
      'success',
      FeedbackMessages.GET_DETAIL_EVENT_FEEDBACK,
      result
    ));
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const {
      q,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc'
    } = req.query as {
      q: string;
      page?: string;
      limit?: string;
      sortBy?: 'createdAt' | 'name' | 'email';
      sortOrder?: 'asc' | 'desc';
    };

    const result = await feedbackService.getFeedbacks({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy,
      sortOrder
    });

    return res.status(200).json(
      formatResponse(
        'success',
        FeedbackMessages.GET_ALL_EVENT_FEEDBACK,
        result.feedbacks,
        undefined,
        result.pagination
      )
    );
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}
