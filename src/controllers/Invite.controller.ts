import { Request, Response } from "express";
import { InviteService } from "../services";
import { formatResponse } from "../utils/response.util";
import { InviteMessages } from "../constants/messages";
import { IInvites } from "../interfaces/Invite.interface";
import { HTTP } from "../constants/https";

const inviteService = new InviteService();

/**
 * Controller tạo mới khách mời
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const createInvite = async (req: Request, res: Response) => {
  try {
    const inviteCreate = {
      ...req.body,
      createdBy: req.user?._id
    } as IInvites;

    const invite = await inviteService.create(inviteCreate, req.user);
    
    return res.status(HTTP.CREATED).json(
      formatResponse(
        'success',
        InviteMessages.CREATE_SUCCESSFULLY,
        invite
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
 * Controller cập nhật khách mời
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const updateInvite = async (req: Request, res: Response) => {
  try {
    const inviteUpdate = {
      ...req.body,
      updatedBy: req.user?._id
    } as IInvites;

    const invite = await inviteService.update(
      req.params.id.toString(),
      inviteUpdate,
      req.user
    );

    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        InviteMessages.UPDATE_SUCCESSFULLY,
        invite
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
 * Controller xóa khách mời 
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const deleteInvite = async (req: Request, res: Response) => {
  try {
    await inviteService.delete(req.params.id.toString(), req.user);
    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        InviteMessages.DELETE_SUCCESSFULLY
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
 * Controller lấy thông tin khách mời
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const getDetailInvite = async (req: Request, res: Response) => {
  try {
    const invite = await inviteService.getInviteById(req.params.id.toString(), req.user);

    return res.status(HTTP.OK).json(formatResponse(
      'success',
      InviteMessages.GET_DETAIL_INVITE,
      invite
    ));
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
 * Controller lấy danh sách khách mời
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const getAllInvite = async (req: Request, res: Response) => {
  try {
    const {
      q,
      page,
      limit,
      sortBy = 'createdAt',
      sortOrder = 'asc'
    } = req.query as {
      q: string;
      page?: string;
      limit?: string;
      sortBy?: 'createdAt' | 'name' | 'email';
      sortOrder?: 'desc' | 'asc';
    };

    const result = await inviteService.getAllInvites(q, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy,
      sortOrder
    }, req.user);

    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        InviteMessages.GET_ALL_INVITES,
        result.invites,
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

export const search = async (req: Request, res: Response) => {
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

    const result = await inviteService.search(q, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy,
      sortOrder
    });

    return res.status(200).json(
      formatResponse(
        'success',
        InviteMessages.SEARCH_INVITE,
        result.invites,
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
