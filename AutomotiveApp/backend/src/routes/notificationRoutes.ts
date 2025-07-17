/**
 * Notification routes for the Automotive Service Reminder Agent
 */

import { Router } from 'express';
import * as notificationController from '../controllers/notificationController';

const router = Router();

// POST /api/notify - Manually trigger email/SMS reminders
router.post('/', notificationController.sendNotifications);

export default router;
