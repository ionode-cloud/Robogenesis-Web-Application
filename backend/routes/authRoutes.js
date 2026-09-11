import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

// Authentication Endpoints (POST)
router.post(['/register', '/register/'], AuthController.register);
router.post(['/login', '/login/'], AuthController.login);
router.get(['/me', '/me/'], verifyToken, AuthController.me);

// Informational handlers for GET requests to verify endpoint availability without 405 errors
router.get(['/login', '/login/'], (req, res) => {
  res.status(200).json({
    status: 'online',
    endpoint: '/api/auth/login',
    service: 'Robogenesis Authentication Service',
    message: 'Login endpoint is operational. Submit credentials via POST request with { email, password } payload.',
    methodRequired: 'POST',
  });
});

router.get(['/register', '/register/'], (req, res) => {
  res.status(200).json({
    status: 'online',
    endpoint: '/api/auth/register',
    service: 'Robogenesis Registration Service',
    message: 'Register endpoint is operational. Submit details via POST request with { fullName, email, password } payload.',
    methodRequired: 'POST',
  });
});

export default router;
