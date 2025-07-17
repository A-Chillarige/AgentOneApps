/**
 * Mileage routes for the Automotive Service Reminder Agent
 */

import { Router } from 'express';
import * as mileageController from '../controllers/mileageController';

const router = Router();

// POST /api/mileage - Log a new mileage entry
router.post('/', mileageController.logMileage);

// GET /api/mileage/:vehicleId - Get mileage history for a vehicle
router.get('/:vehicleId', mileageController.getMileageHistory);

// PUT /api/mileage/:id - Update a mileage log
router.put('/:id', mileageController.updateMileageLog);

// DELETE /api/mileage/:id - Delete a mileage log
router.delete('/:id', mileageController.deleteMileageLog);

export default router;
