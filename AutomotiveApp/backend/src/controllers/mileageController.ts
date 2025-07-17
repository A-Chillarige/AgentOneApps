/**
 * Mileage controller for the Automotive Service Reminder Agent
 */

import { Request, Response } from 'express';
import { MileageLog, Vehicle, ServiceSchedule } from '../models';
import { ApiResponse, LogMileageRequest, LogMileageResponse } from '../../../shared/types/api';
import { isValidMileage } from '../../../shared/utils/validators';
import { URGENCY_THRESHOLDS } from '../../../shared/constants/serviceTypes';
import { daysUntilServiceDue } from '../../../shared/utils/dateUtils';

/**
 * Log a new mileage entry for a vehicle
 * @route POST /api/mileage
 */
export const logMileage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vehicleId, mileage, loggedAt }: LogMileageRequest = req.body;
    
    // Validate input
    if (!vehicleId || mileage === undefined) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing required fields'
      };
      res.status(400).json(response);
      return;
    }
    
    if (!isValidMileage(mileage)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid mileage value'
      };
      res.status(400).json(response);
      return;
    }
    
    // Check if vehicle exists
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Vehicle not found'
      };
      res.status(404).json(response);
      return;
    }
    
    // Get the previous mileage log to ensure new mileage is higher
    const previousLog = await MileageLog.findOne({
      where: { vehicleId },
      order: [['loggedAt', 'DESC']]
    });
    
    if (previousLog && previousLog.mileage >= mileage) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'New mileage must be higher than previous mileage'
      };
      res.status(400).json(response);
      return;
    }
    
    // Create mileage log
    const mileageLog = await MileageLog.create({
      vehicleId,
      mileage,
      loggedAt: loggedAt || new Date()
    });
    
    // Calculate upcoming services
    const upcomingServices = await calculateUpcomingServices(vehicle, mileage);
    
    const response: ApiResponse<LogMileageResponse> = {
      success: true,
      data: {
        mileageLog,
        vehicle,
        upcomingServices
      }
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error logging mileage:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to log mileage'
    };
    res.status(500).json(response);
  }
};

/**
 * Get mileage history for a vehicle
 * @route GET /api/mileage/:vehicleId
 */
export const getMileageHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleId = parseInt(req.params.vehicleId, 10);
    
    // Check if vehicle exists
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Vehicle not found'
      };
      res.status(404).json(response);
      return;
    }
    
    // Get mileage logs
    const mileageLogs = await MileageLog.findAll({
      where: { vehicleId },
      order: [['loggedAt', 'DESC']]
    });
    
    const response: ApiResponse<{ mileageLogs: typeof mileageLogs, vehicle: typeof vehicle }> = {
      success: true,
      data: {
        mileageLogs,
        vehicle
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching mileage history:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch mileage history'
    };
    res.status(500).json(response);
  }
};

/**
 * Update a mileage log
 * @route PUT /api/mileage/:id
 */
export const updateMileageLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const logId = parseInt(req.params.id, 10);
    const { mileage, loggedAt } = req.body;
    
    // Find mileage log
    const mileageLog = await MileageLog.findByPk(logId);
    if (!mileageLog) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Mileage log not found'
      };
      res.status(404).json(response);
      return;
    }
    
    // Validate mileage if provided
    if (mileage !== undefined && !isValidMileage(mileage)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid mileage value'
      };
      res.status(400).json(response);
      return;
    }
    
    // Get the vehicle
    const vehicle = await Vehicle.findByPk(mileageLog.vehicleId);
    if (!vehicle) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Vehicle not found'
      };
      res.status(404).json(response);
      return;
    }
    
    // Get adjacent mileage logs to ensure chronological order
    const previousLog = await MileageLog.findOne({
      where: { vehicleId: mileageLog.vehicleId },
      order: [['loggedAt', 'DESC']],
      limit: 1,
      offset: 1
    });
    
    const nextLog = await MileageLog.findOne({
      where: { vehicleId: mileageLog.vehicleId },
      order: [['loggedAt', 'ASC']],
      limit: 1,
      offset: 1
    });
    
    // Validate mileage is in chronological order
    if (mileage !== undefined) {
      if (previousLog && previousLog.mileage >= mileage) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Mileage must be higher than previous log'
        };
        res.status(400).json(response);
        return;
      }
      
      if (nextLog && nextLog.mileage <= mileage) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Mileage must be lower than next log'
        };
        res.status(400).json(response);
        return;
      }
    }
    
    // Update mileage log
    await mileageLog.update({
      mileage: mileage !== undefined ? mileage : mileageLog.mileage,
      loggedAt: loggedAt || mileageLog.loggedAt
    });
    
    // Calculate upcoming services
    const upcomingServices = await calculateUpcomingServices(vehicle, mileageLog.mileage);
    
    const response: ApiResponse<LogMileageResponse> = {
      success: true,
      data: {
        mileageLog,
        vehicle,
        upcomingServices
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error updating mileage log:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update mileage log'
    };
    res.status(500).json(response);
  }
};

/**
 * Delete a mileage log
 * @route DELETE /api/mileage/:id
 */
export const deleteMileageLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const logId = parseInt(req.params.id, 10);
    
    // Find mileage log
    const mileageLog = await MileageLog.findByPk(logId);
    if (!mileageLog) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Mileage log not found'
      };
      res.status(404).json(response);
      return;
    }
    
    // Delete mileage log
    await mileageLog.destroy();
    
    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: {
        message: 'Mileage log deleted successfully'
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error deleting mileage log:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete mileage log'
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
