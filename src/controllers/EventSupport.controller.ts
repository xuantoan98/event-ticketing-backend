import { Request, Response } from "express";
import { EventSupportService } from "../services";
import { formatResponse } from "../utils/response.util";
import { IEventSupport } from "../interfaces/EventSupport.interface";
import { EventSupportMessages } from "../constants/messages";
import EventSupport from "../models/EventSupport.model";
import { HTTP } from "../constants/https";

const eventSupportService = new EventSupportService();

/**
 * 
 * @param req 
 * @param res 
 * @returns new event support
 */
export const createEventSupport = async (req: Request, res: Response) => {
  try {
    const result = await eventSupportService.create({
      ...req.body,
      createdBy: req.user?._id
    }, req.user);

    return res.status(HTTP.CREATED).json(
      formatResponse(
        'success',
        EventSupportMessages.CREATE_SUCCESSFULLY,
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
 * 
 * @param req 
 * @param res 
 * @returns event support updated
 */
export const updateEventSupport = async (req: Request, res: Response) => {
  try {
    const result = await eventSupportService.update(req.params.id, {
      ...req.body,
      updatedBy: req.user?._id
    });
    
    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        EventSupportMessages.UPDATE_SUCCESSFULLY,
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
 * 
 * @param req 
 * @param res 
 * @returns message delete event support
 */
export const deleteEventSupport = async (req: Request, res: Response) => {
  try {
    const eventSupportExit = await EventSupport.findById(req.params.id.toString());
    if(!eventSupportExit) {
      return res.status(404).json(
        formatResponse(
          'error',
          EventSupportMessages.NOT_FOUND
        )
      );
    };

    const result = await eventSupportService.delete(req.params.id);
    return res.status(200).json(
      formatResponse(
        'success',
        EventSupportMessages.DELETE_SUCCESSFULLY
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
 * 
 * @param req 
 * @param res 
 * @returns detail event support
 */
export const getEventSupport = async (req: Request, res: Response) => {
  try {
    const result = await eventSupportService.getEventSupport(req.params.id.toString())
    if(!result) {
      return res.status(404).json(
        formatResponse(
          'error',
          EventSupportMessages.NOT_FOUND
        )
      );
    };

    return res.status(200).json(formatResponse(
      'success',
      EventSupportMessages.GET_DETAIL_EVENT_SUPPORT,
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

/**
 * 
 * @param req 
 * @param res 
 * @returns list event supports
 */
export const getEventSupports = async (req: Request, res: Response) => {
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

    const result = await eventSupportService.getEventSupports(q, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy,
      sortOrder
    });

    return res.status(200).json(
      formatResponse(
        'success',
        EventSupportMessages.GET_ALL_EVENT_SUPPORT,
        result.eventSupports,
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
