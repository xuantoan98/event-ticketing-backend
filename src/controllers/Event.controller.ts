import { Request, Response } from "express";
import { EventService } from "../services";
import { formatResponse } from "../utils/response.util";
import { AuthMessages, EventMessages } from "../constants/messages";
import { Role } from "../constants/enum";
import mongoose, { Schema } from "mongoose";

const eventService = new EventService();

export const createEvent = async(req: Request, res: Response) => {
  try {
    const user = req.user;
    if(!user || ![Role.ADMIN.toString(), Role.ORGANIZER.toString()].includes(user.role)) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.FORBIDDEN
        )
      );
    }
    const eventData = {
      ...req.body,
      createdBy: user?._id
    };

    const event = await eventService.create(eventData);
    return res.status(201).json(
      formatResponse(
        'success',
        EventMessages.CREATED,
        event
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

export const updateEvent = async(req: Request, res: Response) => {
  try {
    const eventId = req.params.id;
    const user = req.user;
    const updateData = req.body;

    if(!user || ![Role.ADMIN.toString(), Role.ORGANIZER.toString()].includes(user.role)) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.FORBIDDEN
        )
      );
    }

    const eventExist = await eventService.getEventById(eventId);
    if(!eventExist) {
      return res.status(500).json(
        formatResponse(
          'error',
          EventMessages.NOT_FOUND
        )
      );
    }

    const result = await eventService.update(eventId, updateData);
    return res.status(200).json(
      formatResponse(
        'success',
        EventMessages.UPDATED,
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

export const deleteEvent = async(req: Request, res: Response) => {
  try {
    
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}

export const getEventById = async(req: Request, res: Response) => {
  try {
    const user = req.user;
    if(!user) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.FORBIDDEN
        )
      );
    }

    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(500).json(
        formatResponse(
          'error',
          EventMessages.ID_NOT_VALID
        )
      );
    }

    const result = await eventService.getEventById(req.params.id);
    return res.status(200).json(
      formatResponse(
        'success',
        EventMessages.GET_DETAIL_EVENT_SUCCESSFULLY,
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

export const getAllEvents = async(req: Request, res: Response) => {
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

    const result = await eventService.getEvents({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy,
      sortOrder
    });
    return res.status(200).json(
      formatResponse(
        'success',
        EventMessages.GET_ALL_EVENT_SUCCESSFULLY,
        result.events,
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

export const cancellEvent = async(req: Request, res: Response) => {
  try {
    const user = req.user;
    if(!user || ![Role.ADMIN.toString(), Role.ORGANIZER.toString()].includes(user.role)) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.FORBIDDEN
        )
      );
    }

    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(500).json(
        formatResponse(
          'error',
          EventMessages.ID_NOT_VALID
        )
      );
    }

    const eventExist = await eventService.getEventById(req.params.id);
    if(!eventExist) {
      return res.status(500).json(
        formatResponse(
          'error',
          EventMessages.NOT_FOUND
        )
      );
    }

    const eventCancelled = await eventService.cancelEvent(req.params.id);
    return res.status(200).json(
      formatResponse(
        'success',
        EventMessages.CANCELL_EVENT_SUCCESSFULLY
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

export const getEventCategories = async(req: Request, res: Response) => {
  try {
    
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}

export const getEventsByTickets = async(req: Request, res: Response) => {
  try {
    
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}