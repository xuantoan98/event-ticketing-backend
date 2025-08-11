import { Request, Response } from "express";
import { EventIniteService } from "../services";
import { formatResponse } from "../utils/response.util";
import { IEventInvite } from "../interfaces/EventInvite.interface";
import { EventInviteMessages } from "../constants/messages";
import EventInvite from "../models/EventInvite.model";

const eventInviteService = new EventIniteService();

/**
 * Controller thêm mới khách mời
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const createEventInvite = async (req:Request, res: Response) => {
  try {
    const user = req.user;
    const eventInviteCreate = {
      ...req.body,
      createdBy: user?._id
    } as IEventInvite;

    const result = await eventInviteService.create(eventInviteCreate);
    return res.status(201).json(
      formatResponse(
        'success',
        EventInviteMessages.CREATE_SUCCESSFULLY,
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

/**
 * Controller cập nhật khách mời
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const updateEventInvite = async (req:Request, res: Response) => {
  try {
    const eventInviteExit = await EventInvite.findById(req.params.id.toString());
    if(!eventInviteExit) {
      return res.status(400).json(
        formatResponse(
          'error',
          EventInviteMessages.NOT_FOUND
        )
      );
    };

    const eventInviteUpdate = {
      ...req.body,
      createdBy: req.user?._id
    } as IEventInvite;

    const result = await eventInviteService.update(req.params.id, eventInviteUpdate);
    return res.status(200).json(
      formatResponse(
        'success',
        EventInviteMessages.UPDATE_SUCCESSFULLY,
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

/**
 * Controller xóa khách mời
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const deleteEventInvite = async (req:Request, res: Response) => {
  try {
    const eventInviteExit = await EventInvite.findById(req.params.id.toString());
    if(!eventInviteExit) {
      return res.status(400).json(
        formatResponse(
          'error',
          EventInviteMessages.NOT_FOUND
        )
      );
    };

    const result = await eventInviteService.delete(req.params.id);
    return res.status(200).json(
      formatResponse(
        'success',
        EventInviteMessages.DELETE_SUCCESSFULLY
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

/**
 * Controller lấy danh sách khách mời
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const getEventInvites = async (req:Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc'
    } = req.query as {
      page?: string;
      limit?: string;
      sortBy?: 'createdAt' | 'name' | 'email';
      sortOrder?: 'asc' | 'desc';
    };

    const result = await eventInviteService.getEventInvites({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy,
      sortOrder
    });

    return res.status(200).json(
      formatResponse(
        'success',
        EventInviteMessages.GET_ALL_EVENT_INVITES,
        result.eventInvites,
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

/**
 * Controller lấy thông tin khách mời
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const getEventInviteById = async (req:Request, res: Response) => {
  try {
    const eventInvite = await eventInviteService.getEventInvite(req.params.id.toString());
    if(!eventInvite) {
      return res.status(400).json(
        formatResponse(
          'error',
          EventInviteMessages.NOT_FOUND
        )
      );
    }

    return res.status(200).json(formatResponse(
      'success',
      EventInviteMessages.GET_DETAIL_EVENT_INVITE,
      eventInvite
    ))
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}
