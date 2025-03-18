import { Request, Response } from 'express';
import { IUserCreate, IUserDocument, IUserResponse, IUserUpdate } from '../interfaces/User.interface';
import { UserService } from '../services/User.service';
import { validationResult } from 'express-validator';

const userService = new UserService();

export const register = async (
  req: Request<{}, {}, IUserCreate>,
  res: Response<{ user: IUserResponse; token: string } | { error: string }>
): Promise<void> => {
  // validate
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: errors.array()[0].msg
    })
    return
  }

  try {
    const user = await userService.createUser(req.body);
    const token = user.generateAuthToken();

    res.status(201).json({
      user: user.toResponse(),
      token
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async(
  req: Request<{}, {}, { email: string, password: string }>,
  res: Response<{ user: IUserResponse; token: string} | { error: string }>
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticate(email, password);
    const token = user.generateAuthToken();

    res.json({
      user: user.toResponse(),
      token
    });
  } catch (error: any) {
    res.status(401).json({
      error: error.message.includes('Email') ? 'Email không tồn tại' : 'Mật khẩu không chính xác'
    });
  }
};

export const getCurrentUser = async(
  req: Request,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.json(userService.getUserById(req.params.id.toString()))
}

export const updateUser = async(
  req: Request,
  res: Response<{ user: IUserResponse } | { error: string }>
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Chỉ cho phép cập nhật các trường này
    const allowedUpdates = ['name', 'password'];
    const updates = Object.keys(req.body);

    // Kiểm tra trường không hợp lệ
    const isValidOperation = updates.every(update => 
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).json({ 
        error: 'Chỉ được cập nhật name hoặc password' 
      });
    }

    // Cập nhật user từ request.user
    const user = await userService.updateUser(
      req.user.id.toString(),
      req.body
    );

    return res.status(201).json({
      user: user.toResponse()
    });
  } catch (error: any) {
    return res.status(400).json({
      error: error.message
    });
  }
}

export const deleteUser = async(
  req: Request,
  res: Response
) => {
  try {
    const user = await userService.deleteUser(req.params.id.toString());
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export const getUsers = async(
  req: Request,
  res: Response<{
    data: IUserResponse[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  } | { error: string }>
) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.body as {
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
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      error: 'Lỗi hệ thống'
    })
  }
}