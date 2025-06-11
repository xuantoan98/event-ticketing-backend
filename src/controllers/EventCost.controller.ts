import { Request, Response } from "express";
import { formatResponse } from "../utils/response.util";
import { IEventCost } from "../interfaces/EventCost.interface";
import { EventCostService } from "../services";
import { EventCostMessages } from "../constants/messages";

const eventCostService = new EventCostService();

export const createEventCost = async (req: Request, res: Response) => {
  try {
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

export const updateEventCost = async (req: Request, res: Response) => {
  try {
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
    res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}

export const deleteEventCost = async (req: Request, res: Response) => {
  try {
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

export const getEventCost = async (req: Request, res: Response) => {
  try {
    const result = await eventCostService.getEventCost(req.params.id);
    return res.status(200).json(
      formatResponse(
        'success',
        EventCostMessages.GET_DETAIL_EVENT_COST,
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
    res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}
