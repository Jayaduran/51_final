import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { asyncHandler } from '../middleware/errorHandler';
import { SignupRequest, LoginRequest } from '../types';

export class AuthController {
  static signup = asyncHandler(async (req: Request, res: Response) => {
    const data: SignupRequest = req.body;
    const result = await AuthService.signup(data);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result
    });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const data: LoginRequest = req.body;
    const result = await AuthService.login(data);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  });

  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await AuthService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: result
    });
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    await AuthService.logout(userId);

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  });

  static changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    const { currentPassword, newPassword } = req.body;

    await AuthService.changePassword(userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  });

  static getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { user }
    });
  });
}
