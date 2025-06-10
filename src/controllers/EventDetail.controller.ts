import { Request, Response } from "express";
import { EventDetailService } from "../services";
import { formatResponse } from "../utils/response.util";
import { IEventDetail } from "../interfaces/EventDetail.interface";
import { EventDetailMessages } from "../constants/messages";

const eventDetailService = new EventDetailService();

export const createEventDetail = async (req: Request, res: Response) => {
  try {
    const dataCreate = {
      ...req.body,
      createdBy: req.user?._id
    } as IEventDetail;

    const result = await eventDetailService.create(dataCreate);
    return res.status(201).json(
      formatResponse(
        'success',
        EventDetailMessages.CREATE_SUCCESSFULLY,
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

export const updateEventDetail = async (req: Request, res: Response) => {
  try {
    const dataUpdate = {
      ...req.body,
      updatedBy: req.user?._id
    } as IEventDetail;

    const result = await eventDetailService.update(req.params.id, dataUpdate);
    return res.status(201).json(
      formatResponse(
        'success',
        EventDetailMessages.UPDATE_SUCCESSFULLY,
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

export const deleteEventDetail = async (req: Request, res: Response) => {
  try {
    const result = await eventDetailService.delete(req.params.id);
    return res.status(200).json(
      formatResponse(
        'success',
        EventDetailMessages.DELETE_SUCCESSFULLY
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

export const getEventDetail = async (req: Request, res: Response) => {
  try {
    const result = await eventDetailService.getEventDetail(req.params.id);
    return res.status(200).json(
      formatResponse(
        'success',
        EventDetailMessages.GET_DETAIL_EVENT_DETAIL,
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

export const getEventDetails = async (req: Request, res: Response) => {
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

    const result = await eventDetailService.getEventDetails(q, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy: sortBy,
      sortOrder: sortOrder
    });

    return res.status(200).json(
      formatResponse(
        'success',
        EventDetailMessages.GET_ALL_EVENT_DETAIL,
        result.eventDetails,
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
