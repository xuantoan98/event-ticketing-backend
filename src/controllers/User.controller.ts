import { Request, Response } from 'express';
import { IUserCreate, IUserDocument, IUserResponse } from '../interfaces/User.interface';
import { UserService } from '../services/User.service';
import { validationResult } from 'express-validator';

const userService = new UserService();

export const register = async (
	req: Request<{}, {}, IUserCreate>,
  res: Response<{ user: IUserResponse; token: string } | { error: string }>
): Promise<void> => {
	// validate
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		res.status(400).json({
			error: errors.array()[0].msg
		});

		return;
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
}