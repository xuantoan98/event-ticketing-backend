import { Request, Response } from 'express';
import { UserService } from '../services';
import { formatResponse } from '../utils/response.util';
import { IUserCreate, IUserDocument } from '../interfaces/User.interface';
import { UserMessages } from '../constants/messages';
import { HTTP } from '../constants/https';
import { ApiError } from '../utils/ApiError';
import { uploadSingleImage } from '../services/upload.service';

const userService = new UserService();

/**
 * Đăng ký người dùng
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const register = async ( req: Request, res: Response) => {
  try {
    const dataUserCreate = {
      ...req.body,
      createdBy: req.user?._id
    } as IUserCreate;
    const user = await userService.createUserWithoutAuth(dataUserCreate);

    return res.status(HTTP.CREATED).json(
      formatResponse(
        'success',
        UserMessages.REGISTER_SUCCESSFULLY,
        user
      )
    )
  } catch (error: any) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

/**
 * Đăng nhập
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const login = async(req: Request,res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticate(email, password);
    const token = user.generateAuthToken();

    return res.status(HTTP.OK).json(
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
    return res.status(500).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

/**
 * Lấy thông tin người dùng hiện tại
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const getCurrentUser = async(req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(HTTP.UNAUTHORIZED, UserMessages.AUTH_ERROR);
    }
  
    const user = await userService.getUserById(req.params.id.toString());
    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        UserMessages.GET_CURRENT_USER_SUCCESSFULLY,
        user
      )
    );
  } catch (error: any) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Lỗi hệ thống: ${error}`
      )
    )
  }
}

/**
 * Cập nhật thông tin người dùng
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const updateUser = async(req: Request, res: Response) => {
  try {
    // Cập nhật user từ request.user
    const user = await userService.updateUser(
      req.params.id.toString(),
      {
        ...req.body,
        updatedBy: req.user
      },
      req.user as IUserDocument
    );

    return res.status(200).json(
      formatResponse(
        'success',
        UserMessages.UPDATE_SUCCESSFULLY,
        user
      )
    )
  } catch (error: any) {
    return res.status(500).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

/**
 * Xóa thông tin người dùng
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const deleteUser = async(req: Request,res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(HTTP.UNAUTHORIZED, UserMessages.AUTH_ERROR);
    }

    const user = await userService.deleteUser(req.params.id.toString());
    if (!user) {
      throw new ApiError(HTTP.NOT_FOUND, UserMessages.USER_NOT_FOUND);
    }

    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        UserMessages.USER_UPDATE_STATUS_SUCCESSFULLY
      )
    )
  } catch (error: any) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

/**
 * Lấy danh sách người dùng
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const getUsers = async(req: Request,res: Response) => {  
  try {
    const { 
      q,
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query as {
      q: string;
      page?: string;
      limit?: string;
      sortBy?: 'createdAt' | 'name' | 'email';
      sortOrder?: 'asc' | 'desc';
    }
    const result = await userService.getPaginatedUsers(q, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sortBy,
      sortOrder
    });

    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        UserMessages.GET_USERS_SUCCESSFULLY,
        result.data,
        undefined,
        result.pagination
      )
    );
  } catch (error: any) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    );
  }
}

// export const searchUsers = async(
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const { q, page = 1, limit = 10 } = req.query as {
//       q: string;
//       page?: string;
//       limit?: string;
//     }

//     const result = await userService.searchUsers(q, {
//       page: parseInt(page as string),
//       limit: parseInt(limit as string)
//     })

//     res.status(200).json(
//       formatResponse(
//         'success',
//         UserMessages.SEARCH_USER_SUCCESSFULLY,
//         result.data,
//         undefined,
//         result.pagination
//       )
//     )
//   } catch (error: any) {
//     res.status(500).json(
//       formatResponse(
//         'error',
//         `Xảy ra lỗi: ${error}`
//       )
//     )
//   }
// }

/**
 * Cập nhật avatar
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const updateAvatar = async(req: Request,res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(HTTP.UNAUTHORIZED, UserMessages.AUTH_ERROR);
    }

    const file = await uploadSingleImage('avatar', req) as any;
    if(!file || !file.path) {
      throw new ApiError(HTTP.INTERNAL_ERROR, UserMessages.USER_CHOOSE_AVT);
    }

    const user = await userService.updateUser(
      req.user?.id.toString(),
      {
        avatar: file.path
      } as IUserDocument,
      req.user as IUserDocument
    );

    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        UserMessages.USER_UPDATE_AVT_SUCCESSFULLY,
        user
      )
    )
  } catch (error: any){
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    )
  }
}

/**
 * Cập nhật mật khẩu
 * @param req 
 * @param res 
 * @returns 
 * 
 */
export const changePassword = async(req: Request,res: Response) => {
  try {
    if (!req.user) {
      throw new ApiError(HTTP.UNAUTHORIZED, UserMessages.AUTH_ERROR);
    }

    const { oldPassword, newPassword } = req.body;
    const isMatch = await req.user.comparePassword(oldPassword);

    if(!isMatch) {
      throw new ApiError(HTTP.INTERNAL_ERROR, UserMessages.PASSWORD_INCORRECT);
    }

    const user = await userService.changePassword(req.user.id, newPassword);
    return res.status(HTTP.OK).json(
      formatResponse(
        'success',
        UserMessages.UPDATE_PASSWORD_SUCCESSFULLY,
        user
      )
    );
  } catch (error: any) {
    return res.status(HTTP.INTERNAL_ERROR).json(
      formatResponse(
        'error',
        `Xảy ra lỗi: ${error}`
      )
    );
  }
}
