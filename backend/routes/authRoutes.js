import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', verifyToken, AuthController.me);

// Informational handlers for GET requests to prevent confusing 404s
router.get('/login', (req, res) => {
  res.status(405).json({
    error: 'Method Not Allowed. Please send a POST request with email and password to log in, or use the Robogenesis web portal interface.',
    endpoint: '/api/auth/login',
    method: 'POST',
  });
});

router.get('/register', (req, res) => {
  res.status(405).json({
    error: 'Method Not Allowed. Please send a POST request with fullName, email, and password to register, or use the Robogenesis web portal interface.',
    endpoint: '/api/auth/register',
    method: 'POST',
  });
});

export default router;
