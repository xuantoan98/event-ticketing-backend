import { Request, Response } from "express";
import { EventService } from "../services";
import { formatResponse } from "../utils/response.util";
import { EventMessages } from "../constants/messages";
import { Role } from "../constants/enum";

const eventService = new EventService();

export const createEvent = async(req: Request, res: Response) => {
  try {
    const user = req.user;
    if(!user || ![Role.ADMIN.toString(), Role.ORGANIZER.toString()].includes(user.role)) {
      return res.status(403).json(
        formatResponse(
          'error',
          'Forbidden'
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
          'Forbidden'
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