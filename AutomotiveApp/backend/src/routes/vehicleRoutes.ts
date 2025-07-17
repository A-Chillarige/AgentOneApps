/**
 * Vehicle routes for the Automotive Service Reminder Agent
 */

import { Router } from 'express';
import * as vehicleController from '../controllers/vehicleController';

const router = Router();

// GET /api/vehicles - List all vehicles or filter by customer
router.get('/', vehicleController.getVehicles);

// GET /api/vehicles/:id - Get a vehicle by ID
router.get('/:id', vehicleController.getVehicleById);

// POST /api/vehicles - Create a new vehicle
router.post('/', vehicleController.createVehicle);

// PUT /api/vehicles/:id - Update a vehicle
router.put('/:id', vehicleController.updateVehicle);

// DELETE /api/vehicles/:id - Delete a vehicle
router.delete('/:id', vehicleController.deleteVehicle);

export default router;
