import { Router } from 'express';
import { ContactController } from '../controllers/contactController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', ContactController.submit);

// Get user's enquiries history
router.get('/my-enquiries', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return verifyToken(req, res, next);
  }
  next();
}, ContactController.getUserEnquiries);

export default router;
