import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../types';

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        error: 'UNAUTHORIZED'
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        loginId: true,
        email: true,
        name: true,
        role: true,
        department: true,
        status: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user || user.status === 'SUSPENDED') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or suspended user',
        error: 'UNAUTHORIZED'
      });
    }

    req.user = user as any;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'UNAUTHORIZED'
    });
  }
  return;
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'UNAUTHORIZED'
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        error: 'FORBIDDEN'
      });
    }
    next();
    return;
  };
};

export const requireAdmin = requireRole(['ADMIN']);
export const requireManagerOrAdmin = requireRole(['ADMIN', 'MANAGER']);
