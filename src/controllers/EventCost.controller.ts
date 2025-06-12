import { Request, Response } from "express";
import { formatResponse } from "../utils/response.util";
import { IEventCost } from "../interfaces/EventCost.interface";
import { EventCostService } from "../services";
import { AuthMessages, EventCostMessages } from "../constants/messages";

const eventCostService = new EventCostService();

/**
 * Create cost event
 * 
 * @param req 
 * @param res 
 * @returns new cost event
 */
export const createEventCost = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.UNAUTHORIZED
        )
      );
    }
    
    const dataCreate = {
      ...req.body,
      createdBy: req.user?._id
    } as IEventCost;

    const result = await eventCostService.create(dataCreate);
    return res.status(201).json(
      formatResponse(
        'success',
        EventCostMessages.CREATE_SUCCESSFULLY,
        result
      )
    );
  } catch (error) {
    res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}

/**
 * Update cost event
 * 
 * @param req 
 * @param res 
 * @returns cost event update
 */
export const updateEventCost = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.UNAUTHORIZED
        )
      );
    }

    const eventCost = await eventCostService.getEventCost(req.params.id);
    if (!eventCost) {
      return res.status(400).json(
        formatResponse(
          'error',
          EventCostMessages.NOT_FOUND
        )
      );
    }

    if (eventCost.createdBy.toString() !== currentUser._id.toString()) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.PERMISSION_DENIED
        )
      );
    }

    const dataUpdate = {
      ...req.body,
      updatedBy: req.user?._id
    } as IEventCost;

    const result = await eventCostService.update(req.params.id, dataUpdate);
    return res.status(200).json(
      formatResponse(
        'success',
        EventCostMessages.UPDATE_SUCCESSFULLY,
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
 * Delete cost event
 * 
 * @param req 
 * @param res 
 * @returns boolean
 */
export const deleteEventCost = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.UNAUTHORIZED
        )
      );
    }

    const eventCost = await eventCostService.getEventCost(req.params.id);
    if (!eventCost) {
      return res.status(400).json(
        formatResponse(
          'error',
          EventCostMessages.NOT_FOUND
        )
      );
    }

    if (eventCost.createdBy.toString() !== currentUser._id.toString()) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.PERMISSION_DENIED
        )
      );
    }

    const result = await eventCostService.delete(req.params.id);
    return res.status(200).json(
      formatResponse(
        'success',
        EventCostMessages.DELETE_SUCCESSFULLY,
        result
      )
    );
  } catch (error) {
    res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}
/**
 * Get detail cost event
 * 
 * @param req 
 * @param res 
 * @returns detail cost event
 */
export const getEventCost = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.UNAUTHORIZED
        )
      );
    }

    const result = await eventCostService.getEventCost(req.params.id);
    if (!result) {
      return res.status(400).json(
        formatResponse(
          'error',
          EventCostMessages.NOT_FOUND
        )
      );
    }

    return res.status(200).json(
      formatResponse(
        'success',
        EventCostMessages.GET_DETAIL_EVENT_COST,
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
 * Get list costs event
 * 
 * @param req 
 * @param res 
 * @returns list costs event
 */
export const getEventCosts = async (req: Request, res: Response) => {
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
      sortBy?: 'createdAt';
      sortOrder?: 'asc' | 'desc';
    };

    const result = await eventCostService.getEventCosts(q, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy: sortBy,
      sortOrder: sortOrder
    });

    return res.status(200).json(
      formatResponse(
        'success',
        EventCostMessages.GET_ALL_EVENT_COST_DETAIL,
        result.eventCosts,
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
