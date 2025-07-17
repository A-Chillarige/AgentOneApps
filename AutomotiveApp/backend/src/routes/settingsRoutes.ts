/**
 * Settings routes for the Automotive Service Reminder Agent
 */

import { Router } from 'express';
import * as settingsController from '../controllers/settingsController';

const router = Router();

// POST /api/settings/reset - Wipe and reload seed data
router.post('/reset', settingsController.resetDatabase);

export default router;
