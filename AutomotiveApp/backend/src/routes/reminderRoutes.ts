/**
 * Reminder routes for the Automotive Service Reminder Agent
 */

import { Router } from 'express';
import * as reminderController from '../controllers/reminderController';

const router = Router();

// GET /api/reminders - Generate and preview upcoming service reminders
router.get('/', reminderController.getReminders);

// GET /api/reminders/vehicle/:id - Get reminders for a specific vehicle
router.get('/vehicle/:id', reminderController.getVehicleReminders);

// GET /api/reminders/customer/:id - Get reminders for a specific customer
router.get('/customer/:id', reminderController.getCustomerReminders);

export default router;
