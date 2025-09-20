import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { signupSchema, loginSchema, refreshTokenSchema, changePasswordSchema } from '../validators/authValidators';

const router = Router();

// Public routes
router.post('/signup', validateRequest(signupSchema), AuthController.signup);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/refresh-token', validateRequest(refreshTokenSchema), AuthController.refreshToken);

// Protected routes
router.post('/logout', authenticateToken, AuthController.logout);
router.get('/profile', authenticateToken, AuthController.getProfile);
router.post('/change-password', authenticateToken, validateRequest(changePasswordSchema), AuthController.changePassword);

export default router;
