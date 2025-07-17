/**
 * Reminder controller for the Automotive Service Reminder Agent
 */

import { Request, Response } from 'express';
import { Vehicle, Customer, MileageLog, ServiceSchedule } from '../models';
import { ApiResponse, GetRemindersResponse, Reminder } from '../../../shared/types/api';
import { URGENCY_THRESHOLDS } from '../../../shared/constants/serviceTypes';
import { formatVehicleName } from '../../../shared/utils/formatters';
import { daysUntilServiceDue } from '../../../shared/utils/dateUtils';

/**
 * Generate and preview upcoming service reminders
 * @route GET /api/reminders
 */
export const getReminders = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = req.query.customerId ? parseInt(req.query.customerId as string, 10) : undefined;
    const vehicleId = req.query.vehicleId ? parseInt(req.query.vehicleId as string, 10) : undefined;
    
    // Build query based on filters
    const whereClause: any = {};
    if (customerId) {
      whereClause.customerId = customerId;
    }
    if (vehicleId) {
      whereClause.id = vehicleId;
    }
    
    // Get vehicles
    const vehicles = await Vehicle.findAll({
      where: whereClause,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'phone', 'preferredReminderType', 'timezone']
        },
        {
          model: MileageLog,
          as: 'mileageLogs',
          limit: 1,
          order: [['loggedAt', 'DESC']]
        }
      ]
    });
    
    // Generate reminders for each vehicle
    const reminders: Reminder[] = [];
    
    for (const vehicle of vehicles) {
      // Skip vehicles with no mileage logs
      if (!vehicle.mileageLogs || vehicle.mileageLogs.length === 0) {
        continue;
      }
      
      const currentMileage = vehicle.mileageLogs[0].mileage;
      const upcomingServices = await calculateUpcomingServices(vehicle, currentMileage);
      
      // Only create a reminder if there are upcoming services
      if (upcomingServices.length > 0) {
        reminders.push({
          customer: vehicle.customer.name,
          vehicle: formatVehicleName(vehicle.year, vehicle.make, vehicle.model),
          upcomingServices,
          actions: {
            emailSent: false,
            smsSent: false,
            calendarInviteAttached: false
          }
        });
      }
    }
    
    const response: ApiResponse<GetRemindersResponse> = {
      success: true,
      data: {
        reminders,
        total: reminders.length
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error generating reminders:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to generate reminders'
    };
    res.status(500).json(response);
  }
};

/**
 * Get reminders for a specific vehicle
 * @route GET /api/reminders/vehicle/:id
 */
export const getVehicleReminders = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleId = parseInt(req.params.id, 10);
    
    // Get vehicle
    const vehicle = await Vehicle.findByPk(vehicleId, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'phone', 'preferredReminderType', 'timezone']
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
    
    // Skip vehicles with no mileage logs
    if (!vehicle.mileageLogs || vehicle.mileageLogs.length === 0) {
      const response: ApiResponse<GetRemindersResponse> = {
        success: true,
        data: {
          reminders: [],
          total: 0
        }
      };
      res.status(200).json(response);
      return;
    }
    
    const currentMileage = vehicle.mileageLogs[0].mileage;
    const upcomingServices = await calculateUpcomingServices(vehicle, currentMileage);
    
    // Create reminder
    const reminder: Reminder = {
      customer: vehicle.customer.name,
      vehicle: formatVehicleName(vehicle.year, vehicle.make, vehicle.model),
      upcomingServices,
      actions: {
        emailSent: false,
        smsSent: false,
        calendarInviteAttached: false
      }
    };
    
    const response: ApiResponse<GetRemindersResponse> = {
      success: true,
      data: {
        reminders: upcomingServices.length > 0 ? [reminder] : [],
        total: upcomingServices.length > 0 ? 1 : 0
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error generating vehicle reminders:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to generate vehicle reminders'
    };
    res.status(500).json(response);
  }
};

/**
 * Get reminders for a specific customer
 * @route GET /api/reminders/customer/:id
 */
export const getCustomerReminders = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = parseInt(req.params.id, 10);
    
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
    
    // Get vehicles for this customer
    const vehicles = await Vehicle.findAll({
      where: { customerId },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'phone', 'preferredReminderType', 'timezone']
        },
        {
          model: MileageLog,
          as: 'mileageLogs',
          limit: 1,
          order: [['loggedAt', 'DESC']]
        }
      ]
    });
    
    // Generate reminders for each vehicle
    const reminders: Reminder[] = [];
    
    for (const vehicle of vehicles) {
      // Skip vehicles with no mileage logs
      if (!vehicle.mileageLogs || vehicle.mileageLogs.length === 0) {
        continue;
      }
      
      const currentMileage = vehicle.mileageLogs[0].mileage;
      const upcomingServices = await calculateUpcomingServices(vehicle, currentMileage);
      
      // Only create a reminder if there are upcoming services
      if (upcomingServices.length > 0) {
        reminders.push({
          customer: vehicle.customer.name,
          vehicle: formatVehicleName(vehicle.year, vehicle.make, vehicle.model),
          upcomingServices,
          actions: {
            emailSent: false,
            smsSent: false,
            calendarInviteAttached: false
          }
        });
      }
    }
    
    const response: ApiResponse<GetRemindersResponse> = {
      success: true,
      data: {
        reminders,
        total: reminders.length
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error generating customer reminders:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to generate customer reminders'
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
