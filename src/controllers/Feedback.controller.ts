import { Request, Response } from "express"
import { formatResponse } from "../utils/response.util";
import { FeedbackService } from "../services";
import { FeedbackMessages } from "../constants/messages";
import { HTTP } from "../constants/https";

const feedbackService = new FeedbackService();

/**
 * Controller tạo mới phản hồi
 * @param req 
 * @param res 
 * @returns 
 * new feedback
 */
export const createFeedback = async (req: Request, res: Response) => {
  try {
    const result = await feedbackService.create(req.body, req.user);
    return res.status(HTTP.CREATED).json(
      formatResponse(
        'success',
        FeedbackMessages.CREATE_SUCCESSFULLY,
        result
      )
    );
  } catch (error) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}

/**
 * Controller cập nhật phản hồi
 * @param req 
 * @param res 
 * @returns 
 * feedback updated
 */
export const updateFeedback = async (req: Request, res: Response) => {
  try {
    const result = await feedbackService.update(req.params.id, req.body, req.user);
    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        FeedbackMessages.UPDATE_SUCCESSFULLY,
        result
      )
    );
  } catch (error) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}

/**
 * Controller xóa phản hồi
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const result = await feedbackService.delete(req.params.id);
    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        FeedbackMessages.DELETE_SUCCESSFULLY,
        result
      )
    );
  } catch (error) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}

/**
 * Controller lấy thông tin phản hồi
 * @param req 
 * @param res 
 * @returns 
 * object feedback
 */
export const getFeedback = async (req: Request, res: Response) => {
  try {
    const result = await feedbackService.getFeedback(req.params.id.toString())
    return res.status(HTTP.OK).json(formatResponse(
      'success',
      FeedbackMessages.GET_DETAIL_EVENT_FEEDBACK,
      result
    ));
  } catch (error) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}

/**
 * Controller lấy danh sách phản hồi
 * @param req 
 * @param res 
 * @returns 
 * list feedbacks
 */
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

    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        FeedbackMessages.GET_ALL_EVENT_FEEDBACK,
        result.feedbacks,
        undefined,
        result.pagination
      )
    );
  } catch (error) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}
