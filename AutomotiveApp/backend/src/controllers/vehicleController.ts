/**
 * Vehicle controller for the Automotive Service Reminder Agent
 */

import { Request, Response } from 'express';
import { Vehicle, Customer, MileageLog, ServiceSchedule } from '../models';
import { ApiResponse, GetVehiclesResponse } from '../../../shared/types/api';
import { isValidVin, isValidYear } from '../../../shared/utils/validators';
import { URGENCY_THRESHOLDS } from '../../../shared/constants/serviceTypes';

/**
 * Get all vehicles or filter by customer ID
 * @route GET /api/vehicles
 */
export const getVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = req.query.customerId ? parseInt(req.query.customerId as string, 10) : undefined;
    
    const whereClause = customerId ? { customerId } : {};
    
    const vehicles = await Vehicle.findAll({
      where: whereClause,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: MileageLog,
          as: 'mileageLogs',
          limit: 1,
          order: [['loggedAt', 'DESC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    // Add nextService property to each vehicle
    for (const vehicle of vehicles) {
      if (vehicle.mileageLogs && vehicle.mileageLogs.length > 0) {
        const currentMileage = vehicle.mileageLogs[0].mileage;
        const upcomingServices = await calculateUpcomingServices(vehicle, currentMileage);
        
        if (upcomingServices.length > 0) {
          // Add the most urgent service as the nextService
          vehicle.nextService = upcomingServices[0];
        }
      }
    }
    
    const response: ApiResponse<GetVehiclesResponse> = {
      success: true,
      data: {
        vehicles,
        total: vehicles.length
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch vehicles'
    };
    res.status(500).json(response);
  }
};

/**
 * Get a vehicle by ID
 * @route GET /api/vehicles/:id
 */
export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleId = parseInt(req.params.id, 10);
    
    const vehicle = await Vehicle.findByPk(vehicleId, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: MileageLog,
          as: 'mileageLogs',
          limit: 1,
          order: [['loggedAt', 'DESC']]
        }
      ]
    });
    
    if (!vehicle) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Vehicle not found'
      };
      res.status(404).json(response);
      return;
    }
    
    // Add nextService property if mileage logs exist
    if (vehicle.mileageLogs && vehicle.mileageLogs.length > 0) {
      const currentMileage = vehicle.mileageLogs[0].mileage;
      const upcomingServices = await calculateUpcomingServices(vehicle, currentMileage);
      
      if (upcomingServices.length > 0) {
        // Add the most urgent service as the nextService
        vehicle.nextService = upcomingServices[0];
      }
    }
    
    const response: ApiResponse<{ vehicle: typeof vehicle }> = {
      success: true,
      data: {
        vehicle
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch vehicle'
    };
    res.status(500).json(response);
  }
};

/**
 * Create a new vehicle
 * @route POST /api/vehicles
 */
export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vin, make, model, year, customerId } = req.body;
    
    // Validate input
    if (!vin || !make || !model || !year || !customerId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing required fields'
      };
      res.status(400).json(response);
      return;
    }
    
    if (!isValidVin(vin)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid VIN format'
      };
      res.status(400).json(response);
      return;
    }
    
    if (!isValidYear(year)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid year'
      };
      res.status(400).json(response);
      return;
    }
    
    // Check if customer exists
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Customer not found'
      };
      res.status(404).json(response);
      return;
    }
    
    // Check if VIN already exists
    const existingVehicle = await Vehicle.findOne({ where: { vin } });
    if (existingVehicle) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Vehicle with this VIN already exists'
      };
      res.status(409).json(response);
      return;
    }
    
    // Create vehicle
    const vehicle = await Vehicle.create({
      vin,
      make,
      model,
      year,
      customerId
    });
    
    const response: ApiResponse<{ vehicle: typeof vehicle }> = {
      success: true,
      data: {
        vehicle
      }
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create vehicle'
    };
    res.status(500).json(response);
  }
};

/**
 * Update a vehicle
 * @route PUT /api/vehicles/:id
 */
export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleId = parseInt(req.params.id, 10);
    const { make, model, year, customerId } = req.body;
    
    // Find vehicle
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Vehicle not found'
      };
      res.status(404).json(response);
      return;
    }
    
    // Validate input if provided
    if (year && !isValidYear(year)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid year'
      };
      res.status(400).json(response);
      return;
    }
    
    // Check if customer exists if customerId is provided
    if (customerId) {
      const customer = await Customer.findByPk(customerId);
      if (!customer) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Customer not found'
        };
        res.status(404).json(response);
        return;
      }
    }
    
    // Update vehicle
    await vehicle.update({
      make: make || vehicle.make,
      model: model || vehicle.model,
      year: year || vehicle.year,
      customerId: customerId || vehicle.customerId
    });
    
    const updatedVehicle = await Vehicle.findByPk(vehicleId, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: MileageLog,
          as: 'mileageLogs',
          limit: 1,
          order: [['loggedAt', 'DESC']]
        }
      ]
    });
    
    // Add nextService property if mileage logs exist
    if (updatedVehicle.mileageLogs && updatedVehicle.mileageLogs.length > 0) {
      const currentMileage = updatedVehicle.mileageLogs[0].mileage;
      const upcomingServices = await calculateUpcomingServices(updatedVehicle, currentMileage);
      
      if (upcomingServices.length > 0) {
        // Add the most urgent service as the nextService
        updatedVehicle.nextService = upcomingServices[0];
      }
    }
    
    const response: ApiResponse<{ vehicle: typeof updatedVehicle }> = {
      success: true,
      data: {
        vehicle: updatedVehicle
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update vehicle'
    };
    res.status(500).json(response);
  }
};

/**
 * Delete a vehicle
 * @route DELETE /api/vehicles/:id
 */
export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleId = parseInt(req.params.id, 10);
    
    // Find vehicle
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Vehicle not found'
      };
      res.status(404).json(response);
      return;
    }
    
    // Delete vehicle
    await vehicle.destroy();
    
    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: {
        message: 'Vehicle deleted successfully'
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete vehicle'
    };
    res.status(500).json(response);
  }
};

/**
 * Calculate upcoming services for a vehicle based on current mileage
 * @param vehicle The vehicle to calculate services for
 * @param currentMileage The current mileage of the vehicle
 * @returns Array of upcoming services
 */
const calculateUpcomingServices = async (
  vehicle: any,
  currentMileage: number
): Promise<Array<{ type: string; dueInMiles: number; dueInDays: number }>> => {
  // Get the last mileage log to calculate average daily mileage
  const mileageLogs = await MileageLog.findAll({
    where: { vehicleId: vehicle.id },
    order: [['loggedAt', 'DESC']],
    limit: 2
  });
  
  // If we have at least 2 logs, calculate average daily mileage
  let avgDailyMileage = 30; // Default to 30 miles per day
  if (mileageLogs.length >= 2) {
    const latestLog = mileageLogs[0];
    const previousLog = mileageLogs[1];
    const daysBetween = Math.max(1, Math.round(
      (latestLog.loggedAt.getTime() - previousLog.loggedAt.getTime()) / (1000 * 60 * 60 * 24)
    ));
    avgDailyMileage = Math.round((latestLog.mileage - previousLog.mileage) / daysBetween);
    avgDailyMileage = Math.max(1, avgDailyMileage); // Ensure at least 1 mile per day
  }
  
  // Get service schedules for this vehicle's make and model
  const serviceSchedules = await ServiceSchedule.findAll({
    where: {
      make: vehicle.make,
      model: vehicle.model
    }
  });
  
  // Calculate upcoming services
  const upcomingServices = [];
  
  for (const schedule of serviceSchedules) {
    // Calculate miles until next service
    const milesSinceLastService = currentMileage % schedule.intervalMiles;
    const milesUntilService = schedule.intervalMiles - milesSinceLastService;
    
    // Calculate days until next service based on average daily mileage
    const daysUntilService = Math.round(milesUntilService / avgDailyMileage);
    
    // Check if service is due within the threshold
    if (milesUntilService <= URGENCY_THRESHOLDS.MILES.UPCOMING || daysUntilService <= URGENCY_THRESHOLDS.DAYS.UPCOMING) {
      upcomingServices.push({
        type: schedule.serviceType,
        dueInMiles: milesUntilService,
        dueInDays: daysUntilService
      });
    }
  }
  
  // Sort by urgency (miles due)
  upcomingServices.sort((a, b) => a.dueInMiles - b.dueInMiles);
  
  return upcomingServices;
};
