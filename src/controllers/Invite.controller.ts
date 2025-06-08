import { Request, Response } from "express";
import { InviteService } from "../services";
import { formatResponse } from "../utils/response.util";
import Invite from "../models/Invite.model";
import { InviteMessages } from "../constants/messages";
import { IInvites } from "../interfaces/Invite.interface";

const inviteService = new InviteService();

export const createInvite = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const inviteExit = await Invite.findOne({
      name: req.body.name,
      email: req.body.email
    });
    
    if(inviteExit) {
      return res.status(400).json(
        formatResponse(
          'error',
          InviteMessages.INVITE_EXITS
        )
      )
    }

    const inviteCreate = {
      ...req.body,
      createdAt: req.user?._id
    } as IInvites;

    const invite = await inviteService.create(inviteCreate);
    
    return res.status(201).json(
      formatResponse(
        'success',
        InviteMessages.CREATE_SUCCESSFULLY,
        invite
      )
    )
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}

export const updateInvite = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const inviteExit = await Invite.findById(req.params.id.toString());
    if(!inviteExit) {
      return res.status(400).json(
        formatResponse(
          'error',
          InviteMessages.NOT_FOUND
        )
      );
    };

    const inviteUpdate = {
      ...req.body,
      updatedBy: req.user?._id
    } as IInvites;

    const invite = await inviteService.update(
      req.params.id.toString(),
      inviteUpdate
    );

    return res.status(200).json(
      formatResponse(
        'success',
        InviteMessages.UPDATE_SUCCESSFULLY,
        invite
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

export const deleteInvite = async (req: Request, res: Response) => {
  try {
    const inviteExit = await Invite.findById(req.params.id.toString());
    if(!inviteExit) {
      res.status(500).json(
        formatResponse(
          'error',
          InviteMessages.NOT_FOUND
        )
      );
    };

    const invite = await inviteService.delete(req.params.id.toString());
    return res.status(200).json(
      formatResponse(
        'success',
        InviteMessages.DELETE_SUCCESSFULLY
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

export const getDetailInvite = async (req: Request, res: Response) => {
  try {
    const invite = await inviteService.getInviteById(req.params.id.toString());

    if(!invite) {
      return res.status(400).json(
        formatResponse(
          'error',
          InviteMessages.NOT_FOUND
        )
      );
    }

    return res.status(200).json(formatResponse(
      'success',
      InviteMessages.GET_DETAIL_INVITE,
      invite
    ))
  } catch (error) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    );
  }
}

export const getAllInvite = async (req: Request, res: Response) => {
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

    const result = await inviteService.getAllInvites({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy,
      sortOrder
    });

    return res.status(200).json(
      formatResponse(
        'success',
        InviteMessages.GET_ALL_INVITES,
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
