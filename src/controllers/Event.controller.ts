import { Request, Response } from "express";
import { EventService } from "../services";
import { formatResponse } from "../utils/response.util";
import { AuthMessages, EventMessages } from "../constants/messages";
import { Role } from "../constants/enum";
import mongoose from "mongoose";
import { IEvent } from "../interfaces/Event.interface";

const eventService = new EventService();

export const createEvent = async(req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    // if(!currentUser || ![Role.ADMIN.toString(), Role.ORGANIZER.toString()].includes(currentUser.role)) {
    //   return res.status(403).json(
    //     formatResponse(
    //       'error',
    //       AuthMessages.FORBIDDEN
    //     )
    //   );
    // }

    if (!currentUser) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.FORBIDDEN
        )
      );
    }

    const eventData = {
      ...req.body,
      createdBy: currentUser?._id
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
    const currentUser = req.user;
    // if(!currentUser || ![Role.ADMIN.toString(), Role.ORGANIZER.toString()].includes(currentUser.role)) {
    //   return res.status(403).json(
    //     formatResponse(
    //       'error',
    //       AuthMessages.FORBIDDEN
    //     )
    //   );
    // }

    if (!currentUser) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.FORBIDDEN
        )
      );
    }

    const eventExist = await eventService.getEventById(eventId);
    if(!eventExist) {
      return res.status(400).json(
        formatResponse(
          'error',
          EventMessages.NOT_FOUND
        )
      );
    }

    // Người dùng không tạo sự kiện thì không được sửa
    if (eventExist.createdBy.toString() !== currentUser?._id.toString()) {
      return res.status(403).json(
        formatResponse(
          'error',
          AuthMessages.FORBIDDEN
        )
      );
    }

    const updateData = {
      ...req.body,
      updatedBy: currentUser._id
    } as IEvent;

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

export const cancellEvent = async(req: Request, res: Response) => {
  try {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json(
        formatResponse(
          'error',
          EventMessages.ID_NOT_VALID
        )
      );
    }

    const user = req.user;
    const eventExist = await eventService.getEventById(req.params.id);
    // if(!user || ![Role.ADMIN.toString(), Role.ORGANIZER.toString()].includes(user.role)) {
    //   return res.status(403).json(
    //     formatResponse(
    //       'error',
    //       AuthMessages.FORBIDDEN
    //     )
    //   );
    // }

    if (!user || eventExist?.createdBy.toString() !== user._id.toString()) {
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