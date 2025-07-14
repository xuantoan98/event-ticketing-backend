import { Request, Response } from "express";
import { EventCategoriesService } from "../services/EventCategories.service";
import { formatResponse } from "../utils/response.util";
import { EventCategoriesMessages } from "../constants/messages";
import { HTTP } from "../constants/https";

const eventCategoriesService = new EventCategoriesService();

/**
 * Get list event categories
 * 
 * @param req 
 * @param res 
 * @returns list event categories
 */
export const getAllEventCategories = async (req: Request, res: Response) => {
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
      sortBy?: 'createdAt' | 'name';
      sortOrder?: 'asc' | 'desc';
    };

    const result = await eventCategoriesService.getEventCategories(q, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy,
      sortOrder
    });

    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        EventCategoriesMessages.GET_ALL_EVENT_CATEGORY_SUCCESSFULLY,
        result.eventCats,
        undefined,
        result.pagination
      )
    );
  } catch (error) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

// export const search = async (req: Request, res: Response) => {
//   try {
//     const { q, page = 1, limit = 10 } = req.query as {
//       q: string;
//       page?: string;
//       limit?: string;
//     };

//     const result = await eventCategoriesService.search(q, {
//       page: parseInt(page as string),
//       limit: parseInt(limit as string)
//     });

//     return res.status(200).json(
//       formatResponse(
//         'success',
//         EventCategoriesMessages.SEARCH_EVENT_CATEGORY_SUCCESSFULLY,
//         result.eventCats,
//         undefined,
//         result.pagination
//       )
//     )
//   } catch (error) {
//     return res.status(500).json(
//       formatResponse(
//         'error',
//         `Xảy ra lỗi: ${error}`
//       )
//     )
//   }
// }

/**
 * Get detail event category
 * 
 * @param req 
 * @param res 
 * @returns event category
 */
export const getDetailEventCategories = async (req: Request, res: Response) => {
  try {
    const eventCat = await eventCategoriesService.getEventCategoriesById(req.params.id as string);
    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        EventCategoriesMessages.GET_DETAIL_EVENT_CATEGORY_SUCCESSFULLY,
        eventCat
      )
    );
  } catch (error) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

/**
 * Create event category
 * 
 * @param req 
 * @param res 
 * @returns new event category
 */
export const createEventCategories = async(req: Request, res: Response) => {
  try {
    const result = await eventCategoriesService.create({
      ...req.body,
      createdBy: req.user?.id
    }, req.user);

    return res.status(HTTP.CREATED).json(
      formatResponse(
        'success',
        EventCategoriesMessages.CREATED,
        result
      )
    );
  } catch (error) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

/**
 * Update event category
 * 
 * @param req 
 * @param res 
 * @returns update event category
 */
export const updateEventCategories = async (req: Request, res: Response) => {
  try {
    const eventCat = await eventCategoriesService.update(
      req.params.id.toString(),
      req.body,
      req.user
    );

    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        EventCategoriesMessages.UPDATED,
        eventCat
      )
    );
  } catch (error) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

/**
 * Delete event category
 * 
 * @param req 
 * @param res 
 * @returns boolean
 */
export const deleteEventCategories = async (req: Request, res: Response) => {
  try {
    await eventCategoriesService.delete(req.params.id.toString(), req.user);
    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        EventCategoriesMessages.DELETED
      )
    );
  } catch (error) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}
