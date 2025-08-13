import { Request, Response } from "express";
import { EventService } from "../services";
import { formatResponse } from "../utils/response.util";
import { AuthMessages, EventMessages } from "../constants/messages";
import mongoose from "mongoose";
import { IEvent } from "../interfaces/Event.interface";
import { HTTP } from "../constants/https";

const eventService = new EventService();

/**
 * Create event
 * 
 * @param req 
 * @param res 
 * @returns new event
 */
export const createEvent = async(req: Request, res: Response) => {
  try {
    const event = await eventService.create(
      {
        ...req.body,
        createdBy: req.user?.id
      }, req.user
    );
    return res.status(HTTP.CREATED).json(
      formatResponse(
        'success',
        EventMessages.CREATED,
        event
      )
    );
  } catch (error) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `${error}`
      )
    );
  }
}

/**
 * Update event
 * 
 * @param req 
 * @param res 
 * @returns update event
 */
export const updateEvent = async(req: Request, res: Response) => {
  try {
    const updateData = {
      ...req.body,
      updatedBy: req.user?._id
    } as IEvent;

    const result = await eventService.update(req.params.id, updateData, req.user);
    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        EventMessages.UPDATED,
        result
      )
    );
  } catch (error) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `${error}`
      )
    );
  }
}

/**
 * Delete event
 * 
 * @param req 
 * @param res 
 * @returns boolean
 */
export const deleteEvent = async(req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    const eventExist = await eventService.getEventById(req.params.id);

    if (!currentUser || eventExist?.createdBy.toString() !== currentUser._id.toString()) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.FORBIDDEN
        )
      );
    }

    if(!eventExist) {
      return res.status(400).json(
        formatResponse(
          'error',
          EventMessages.NOT_FOUND
        )
      );
    }

    const result = await eventService.delete(req.params.id);
    return res.status(200).json(
      formatResponse(
        'success',
        EventMessages.DELETE_SUCCESSFULLY
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
 * Get detail event
 * 
 * @param req 
 * @param res 
 * @returns detail event
 */
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
      return res.status(400).json(
        formatResponse(
          'error',
          EventMessages.ID_NOT_VALID
        )
      );
    }

    const result = await eventService.getEventById(req.params.id);
    if (!result) {
      return res.status(400).json(
        formatResponse(
          'error',
          EventMessages.NOT_FOUND
        )
      );
    }

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

/**
 * Get list events
 * 
 * @param req 
 * @param res 
 * @returns list events
 */
export const getAllEvents = async(req: Request, res: Response) => {
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

    const result = await eventService.getEvents(q, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy,
      sortOrder
    });
    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        EventMessages.GET_ALL_EVENT_SUCCESSFULLY,
        result.events,
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

// export const searchEvents = async(req: Request, res: Response) => {
//   try {
//     const {
//       q,
//       page = 1,
//       limit = 10,
//       sortBy = 'createdAt',
//       sortOrder = 'asc'
//     } = req.query as {
//       q: string,
//       page?: string;
//       limit?: string;
//       sortBy?: 'createdAt' | 'name' | 'email';
//       sortOrder?: 'asc' | 'desc';
//     };

//     const result = await eventService.search(q, {
//       page: parseInt(page as string),
//       limit: parseInt(limit as string),
//       sortBy,
//       sortOrder
//     });
//     return res.status(200).json(
//       formatResponse(
//         'success',
//         EventMessages.GET_ALL_EVENT_SUCCESSFULLY,
//         result.events,
//         undefined,
//         result.pagination
//       )
//     );
//   } catch (error) {
//     return res.status(500).json(
//       formatResponse(
//         'error',
//         `Lỗi hệ thống: ${error}`
//       )
//     );
//   }
// }

/**
 * Cancelled event
 * 
 * @param req 
 * @param res 
 * @returns boolean
 */
export const cancellEvent = async(req: Request, res: Response) => {
  try {
    // if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    //   return res.status(400).json(
    //     formatResponse(
    //       'error',
    //       EventMessages.ID_NOT_VALID
    //     )
    //   );
    // }

    // const eventExist = await eventService.getEventById(req.params.id, req.user);
    // console.log(111);
    

    // if(!user || ![Role.ADMIN.toString(), Role.ORGANIZER.toString()].includes(user.role)) {
    //   return res.status(403).json(
    //     formatResponse(
    //       'error',
    //       AuthMessages.FORBIDDEN
    //     )
    //   );
    // }

    // if (!user || eventExist?.createdBy.toString() !== user._id.toString()) {
    //   return res.status(403).json(
    //     formatResponse(
    //       'error',
    //       AuthMessages.FORBIDDEN
    //     )
    //   );
    // }

    // if(!eventExist) {
    //   return res.status(400).json(
    //     formatResponse(
    //       'error',
    //       EventMessages.NOT_FOUND
    //     )
    //   );
    // }

    const eventCancelled = await eventService.cancelEvent(req.params.id, req.user);    
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

/**
 * Get events by category
 * 
 * @param req 
 * @param res 
 * @returns list events by category
 */
export const getEventCategories = async(req: Request, res: Response) => {
  try {
    // if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    //   return res.status(500).json(
    //     formatResponse(
    //       'error',
    //       EventMessages.ID_NOT_VALID
    //     )
    //   );
    // }

    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc'
    } = req.query as {
      page?: string;
      limit?: string;
      sortBy?: 'createdAt' | 'name';
      sortOrder?: 'asc' | 'desc';
    };
    const cateIds = req.params.categoryIds?.split(',');

    // validate mảng categories id
    if(!Array.isArray(cateIds) || cateIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json(
        formatResponse(
          'error',
          EventMessages.ARRAY_ID_CATEGORIES_INVALID
        )
      );
    }

    const result = await eventService.getEventsByCategories(cateIds, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy,
      sortOrder
    })

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

export const getEventsByTickets = async(req: Request, res: Response) => {
  try {
    return res.status(400).json({ message: 'Tính năng chưa được phát triển' });
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}

export const getMyEvents = async(req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(HTTP.UNAUTHORIZED).json(
        formatResponse(
          'error',
          AuthMessages.UNAUTHORIZED
        )
      );
    }
    const events = await eventService.getMyEvents(req.user);
    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        EventMessages.GET_ALL_EVENT_SUCCESSFULLY,
        events
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
