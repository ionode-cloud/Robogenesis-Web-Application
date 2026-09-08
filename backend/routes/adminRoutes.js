import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all admin routes with verifyAdmin middleware
router.use(verifyAdmin);

// Enquiries
router.get('/enquiries', AdminController.getEnquiries);
router.patch('/enquiries/:id/status', AdminController.updateEnquiryStatus);
router.delete('/enquiries/:id', AdminController.deleteEnquiry);

// Registered Users
router.get('/users', AdminController.getUsers);

// Admin Credentials Management
router.get('/credentials', AdminController.getAdminCredentials);
router.post('/credentials', AdminController.createAdminCredential);
router.put('/credentials/:id', AdminController.updateAdminCredential);
router.delete('/credentials/:id', AdminController.deleteAdminCredential);

export default router;
