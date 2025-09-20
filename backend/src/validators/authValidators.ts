import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    loginId: z.string().min(3, 'Login ID must be at least 3 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().optional(),
    role: z.enum(['ADMIN', 'MANAGER', 'OPERATOR', 'INVENTORY']).optional(),
    department: z.string().optional(),
    phone: z.string().optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    loginId: z.string().min(1, 'Login ID is required'),
    password: z.string().min(1, 'Password is required')
  })
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
  })
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters')
  })
});
