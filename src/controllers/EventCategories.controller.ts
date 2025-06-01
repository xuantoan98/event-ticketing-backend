import { Request, Response } from "express";
import { EventCategoriesService } from "../services/EventCategories.service";
import { formatResponse } from "../utils/response.util";
import { EventCategoriesMessages } from "../constants/messages";
import EventCategories from "../models/EventCategories.model";

const eventCategoriesService = new EventCategoriesService();

export const getAllEventCategories = async (req: Request, res: Response) => {
  try {
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

    const result = await eventCategoriesService.getEventCategories({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy,
      sortOrder
    });

    return res.status(200).json(
      formatResponse(
        'success',
        EventCategoriesMessages.GET_ALL_EVENT_CATEGORY_SUCCESSFULLY,
        result.eventCats,
        undefined,
        result.pagination
      )
    );
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

export const search = async (req: Request, res: Response) => {
  try {
    const { q, page = 1, limit = 10 } = req.query as {
      q: string;
      page?: string;
      limit?: string;
    };

    const result = await eventCategoriesService.search(q, {
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });

    return res.status(200).json(
      formatResponse(
        'success',
        EventCategoriesMessages.SEARCH_EVENT_CATEGORY_SUCCESSFULLY,
        result.eventCats,
        undefined,
        result.pagination
      )
    )
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

export const getDetailEventCategories = async (req: Request, res: Response) => {
  try {
    const eventCat = await eventCategoriesService.getEventCategoriesById(req.params.id as string);
    if(!eventCat) {
      return res.status(404).json(
        formatResponse(
          'error',
          EventCategoriesMessages.NOT_FOUND
        )
      )
    }

    return res.status(200).json(
      formatResponse(
        'success',
        EventCategoriesMessages.GET_DETAIL_EVENT_CATEGORY_SUCCESSFULLY,
        eventCat
      )
    );
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

export const createEventCategories = async(req: Request, res: Response) => {
  try {
    const eventCatExit = await EventCategories.findOne({
      name: req.body.name,
    });

    if(eventCatExit) {
      return res.status(500).json(
        formatResponse(
          'error',
          EventCategoriesMessages.EVENT_CATEGORY_EXIT
        )
      )
    }

    const result = await eventCategoriesService.create(req.body);
    return res.status(201).json(
      formatResponse(
        'success',
        EventCategoriesMessages.CREATED,
        result
      )
    );
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

export const updateEventCategories = async (req: Request, res: Response) => {
  try {
    const eventCatExit = EventCategories.findById(req.params.id.toString());
    if(!eventCatExit) {
      return res.status(404).json(
        formatResponse(
          'error',
          EventCategoriesMessages.NOT_FOUND
        )
      );
    }

    const eventCat = await eventCategoriesService.update(
      req.params.id.toString(),
      req.body
    );

    return res.status(200).json(
      formatResponse(
        'success',
        EventCategoriesMessages.UPDATED,
        eventCat
      )
    );
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

export const deleteEventCategories = async (req: Request, res: Response) => {
  try {
    const eventCatExit = EventCategories.findById(req.params.id.toString());
    if(!eventCatExit) {
      return res.status(404).json(
        formatResponse(
          'error',
          EventCategoriesMessages.NOT_FOUND
        )
      );
    }

    await eventCategoriesService.delete(req.params.id.toString());
    return res.status(200).json(
      formatResponse(
        'success',
        EventCategoriesMessages.DELETED
      )
    );
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}
