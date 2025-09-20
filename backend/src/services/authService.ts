import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import prisma from '../config/database';
import env from '../config/env';
import { SignupRequest, LoginRequest, AuthResponse } from '../types';
import { createError } from '../middleware/errorHandler';

export class AuthService {
  static async signup(data: SignupRequest): Promise<AuthResponse> {
    const { loginId, email, password, name, role = 'OPERATOR', department, phone } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { loginId },
          { email }
        ]
      }
    });

    if (existingUser) {
      throw createError('User with this login ID or email already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, parseInt(env.BCRYPT_ROUNDS));

    // Create user
    const user = await prisma.user.create({
      data: {
        loginId,
        email,
        password: hashedPassword,
        name: name || loginId,
        role: role as any,
        department,
        phone,
        status: 'ACTIVE'
      },
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

    // Generate tokens
    const token = this.generateToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user,
      token,
      refreshToken
    };
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    const { loginId, password } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { loginId }
    });

    if (!user) {
      throw createError('Invalid credentials', 401);
    }

    // Check if user is active
    if (user.status === 'SUSPENDED') {
      throw createError('Account is suspended', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401);
    }

    // Generate tokens
    const token = this.generateToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      refreshToken
    };
  }

  static async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as { userId: string };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, status: true }
      });

      if (!user || user.status === 'SUSPENDED') {
        throw createError('Invalid refresh token', 401);
      }

      const token = this.generateToken(user.id);
      return { token };
    } catch (error) {
      throw createError('Invalid refresh token', 401);
    }
  }

  static async logout(userId: string): Promise<void> {
    // In a more sophisticated setup, you might want to blacklist the token
    // For now, we'll just return success
    // You could implement token blacklisting using Redis or database
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw createError('Current password is incorrect', 400);
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, parseInt(env.BCRYPT_ROUNDS));

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });
  }

  private static generateToken(userId: string): string {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as any };
    return jwt.sign(
      { userId },
      String(env.JWT_SECRET || ''),
      options
    );
  }

  private static generateRefreshToken(userId: string): string {
  const options: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any };
    return jwt.sign(
      { userId },
      String(env.JWT_SECRET || ''),
      options
    );
  }
}
