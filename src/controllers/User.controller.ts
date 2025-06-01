import { Request, Response } from 'express';
import { UserService } from '../services';
import { validationResult } from 'express-validator';
import { formatResponse } from '../utils/response.util';
import { IUserDocument } from '../interfaces/User.interface';
import { UserMessages } from '../constants/messages';

const userService = new UserService();

export const register = async (
  req: Request,
  res: Response
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(
      formatResponse(
        'error',
        errors.array()[0].msg
      )
    )
  }

  try {
    const user = await userService.createUser(req.body);
    const token = user.generateAuthToken();

    res.status(201).json(
      formatResponse(
        'success',
        UserMessages.REGISTER_SUCCESSFULLY,
        user,
        token
      )
    )
  } catch (error: any) {
    res.status(500).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

export const login = async(
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body
    const user = await userService.authenticate(email, password)
    const token = user.generateAuthToken()

    res.status(200).json(
      formatResponse(
        'success',
        UserMessages.LOGIN_SUCCESSFULLY,
        {
          user: user,
          token
        }
      )
    )
  } catch (error: any) {
    res.status(500).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

export const getCurrentUser = async(
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json(
        formatResponse(
          'error',
          UserMessages.AUTH_ERROR
        )
      )
    }
  
    const user = await userService.getUserById(req.params.id.toString())
    res.status(200).json(
      formatResponse(
        'success',
        UserMessages.GET_CURRENT_USER_SUCCESSFULLY,
        user
      )
    )
  } catch (error: any) {
    res.status(500).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    )
  }
}

export const updateUser = async(
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json(
        formatResponse(
          'error',
          UserMessages.AUTH_ERROR
        )
      )
    }

    // Chỉ cho phép cập nhật các trường này
    const allowedUpdates = ['name', 'password'];
    const updates = Object.keys(req.body);

    // Kiểm tra trường không hợp lệ
    const isValidOperation = updates.every(update => 
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      res.status(400).json(
        formatResponse(
          'error',
          UserMessages.ALLOW_FIELDS_NAME_OR_PASSS_UPDATE
        )
      )
    }

    // Cập nhật user từ request.user
    const user = await userService.updateUser(
      req.params.id.toString(),
      req.body
    )

    res.status(200).json(
      formatResponse(
        'success',
        UserMessages.UPDATE_SUCCESSFULLY,
        user
      )
    )
  } catch (error: any) {
    res.status(500).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

export const deleteUser = async(
  req: Request,
  res: Response
) => {
  try {
    const user = await userService.deleteUser(req.params.id.toString());
    if (!user) {
      res.status(404).json(
        formatResponse(
          'error',
          UserMessages.USER_NOT_FOUND
        )
      )
    }
    res.status(200).json(
      formatResponse(
        'success',
        UserMessages.USER_UPDATE_STATUS_SUCCESSFULLY
      )
    )
  } catch (error: any) {
    res.status(500).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

export const getUsers = async(
  req: Request,
  res: Response
) => {  
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query as {
      page?: string;
      limit?: string;
      sortBy?: 'createdAt' | 'name' | 'email';
      sortOrder?: 'asc' | 'desc';
    }
    const result = await userService.getPaginatedUsers({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy,
      sortOrder
    })

    res.status(200).json(
      formatResponse(
        'success',
        UserMessages.GET_USERS_SUCCESSFULLY,
        result.data,
        undefined,
        result.pagination
      )
    )
  } catch (error: any) {
    res.status(500).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

export const searchUsers = async(
  req: Request,
  res: Response
) => {
  try {
    const { q, page = 1, limit = 10 } = req.query as {
      q: string;
      page?: string;
      limit?: string;
    }

    const result = await userService.searchUsers(q, {
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    })

    res.status(200).json(
      formatResponse(
        'success',
        UserMessages.SEARCH_USER_SUCCESSFULLY,
        result.data,
        undefined,
        result.pagination
      )
    )
  } catch (error: any) {
    res.status(500).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

export const updateAvatar = async(
  req: Request,
  res: Response
) => {
  try {
    if(!req.user) {
      return res.status(401).json(
        formatResponse(
          'error',
          'Forbidden'
        )
      )
    }

    if(!req.file) {
      return res.status(500).json(
        formatResponse(
          'error',
          UserMessages.USER_CHOOSE_AVT
        )
      )
    }

    const user = await userService.updateUser(
      req.user?.id.toString(),
      {
        avatar: req.file?.path
      } as IUserDocument
    )

    res.status(200).json(
      formatResponse(
        'success',
        UserMessages.USER_UPDATE_AVT_SUCCESSFULLY,
        user
      )
    )
  } catch (error: any){
    res.status(500).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

export const changePassword = async(
  req: Request,
  res: Response
) => {
  try {
    if(!req.user) {
      return res.status(401).json(
        formatResponse(
          'error',
          'Forbidden'
        )
      )
    }

    const { oldPassword, newPassword } = req.body
    const isMatch = await req.user.comparePassword(oldPassword)

    if(!isMatch) {
      return res.status(500).json(
        formatResponse(
          'error',
          UserMessages.PASSWORD_INCORRECT
        )
      )
    }

    const user = await userService.changePassword(req.user.id, newPassword)
    res.status(200).json(
      formatResponse(
        'success',
        UserMessages.UPDATE_PASSWORD_SUCCESSFULLY,
        user
      )
    )

  } catch (error: any) {
    res.status(500).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    );
  }
}
