/**
 * Settings controller for the Automotive Service Reminder Agent
 */

import { Request, Response } from 'express';
import { sequelize, Vehicle, Customer, MileageLog, ServiceSchedule } from '../models';
import { ApiResponse, ResetResponse } from '../../../shared/types/api';
import { SERVICE_INTERVALS, SERVICE_DESCRIPTIONS } from '../../../shared/constants/serviceTypes';
import { ServiceType } from '../../../shared/types/common';

/**
 * Reset the database and load seed data
 * @route POST /api/settings/reset
 */
export const resetDatabase = async (req: Request, res: Response): Promise<void> => {
  try {
    // Drop all tables and recreate them
    await sequelize.sync({ force: true });
    
    // Create sample customers
    const customers = await Customer.bulkCreate([
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '(555) 123-4567',
        preferredReminderType: 'email',
        timezone: 'America/New_York'
      },
      {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '(555) 987-6543',
        preferredReminderType: 'both',
        timezone: 'America/Los_Angeles'
      }
    ]);
    
    // Create sample vehicles
    const vehicles = await Vehicle.bulkCreate([
      {
        vin: '1HGCM82633A123456',
        make: 'Honda',
        model: 'Accord',
        year: 2020,
        customerId: customers[0].id
      },
      {
        vin: 'JH4KA7660NC789012',
        make: 'Toyota',
        model: 'Camry',
        year: 2021,
        customerId: customers[1].id
      },
      {
        vin: '5YJSA1E40FF345678',
        make: 'Tesla',
        model: 'Model S',
        year: 2022,
        customerId: customers[1].id
      }
    ]);
    
    // Create sample mileage logs
    const now = new Date();
    const mileageLogs = [];
    
    // Vehicle 1 mileage logs
    mileageLogs.push(
      {
        vehicleId: vehicles[0].id,
        mileage: 5000,
        loggedAt: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000) // 180 days ago
      },
      {
        vehicleId: vehicles[0].id,
        mileage: 10000,
        loggedAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
      },
      {
        vehicleId: vehicles[0].id,
        mileage: 14500,
        loggedAt: now
      }
    );
    
    // Vehicle 2 mileage logs
    mileageLogs.push(
      {
        vehicleId: vehicles[1].id,
        mileage: 3000,
        loggedAt: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000) // 120 days ago
      },
      {
        vehicleId: vehicles[1].id,
        mileage: 8000,
        loggedAt: now
      }
    );
    
    // Vehicle 3 mileage logs
    mileageLogs.push(
      {
        vehicleId: vehicles[2].id,
        mileage: 2000,
        loggedAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000) // 60 days ago
      },
      {
        vehicleId: vehicles[2].id,
        mileage: 4500,
        loggedAt: now
      }
    );
    
    await MileageLog.bulkCreate(mileageLogs);
    
    // Create service schedules
    const serviceSchedules = [];
    
    // Honda Accord service schedules
    Object.values(ServiceType).forEach(serviceType => {
      serviceSchedules.push({
        make: 'Honda',
        model: 'Accord',
        serviceType,
        description: SERVICE_DESCRIPTIONS[serviceType],
        intervalMiles: SERVICE_INTERVALS[serviceType].miles,
        intervalMonths: SERVICE_INTERVALS[serviceType].months
      });
    });
    
    // Toyota Camry service schedules
    Object.values(ServiceType).forEach(serviceType => {
      serviceSchedules.push({
        make: 'Toyota',
        model: 'Camry',
        serviceType,
        description: SERVICE_DESCRIPTIONS[serviceType],
        intervalMiles: SERVICE_INTERVALS[serviceType].miles,
        intervalMonths: SERVICE_INTERVALS[serviceType].months
      });
    });
    
    // Tesla Model S service schedules (EVs have different service needs)
    serviceSchedules.push(
      {
        make: 'Tesla',
        model: 'Model S',
        serviceType: ServiceType.TIRE_ROTATION,
        description: SERVICE_DESCRIPTIONS[ServiceType.TIRE_ROTATION],
        intervalMiles: SERVICE_INTERVALS[ServiceType.TIRE_ROTATION].miles,
        intervalMonths: SERVICE_INTERVALS[ServiceType.TIRE_ROTATION].months
      },
      {
        make: 'Tesla',
        model: 'Model S',
        serviceType: ServiceType.BRAKE_INSPECTION,
        description: SERVICE_DESCRIPTIONS[ServiceType.BRAKE_INSPECTION],
        intervalMiles: SERVICE_INTERVALS[ServiceType.BRAKE_INSPECTION].miles,
        intervalMonths: SERVICE_INTERVALS[ServiceType.BRAKE_INSPECTION].months
      },
      {
        make: 'Tesla',
        model: 'Model S',
        serviceType: ServiceType.AIR_FILTER,
        description: SERVICE_DESCRIPTIONS[ServiceType.AIR_FILTER],
        intervalMiles: SERVICE_INTERVALS[ServiceType.AIR_FILTER].miles,
        intervalMonths: SERVICE_INTERVALS[ServiceType.AIR_FILTER].months
      },
      {
        make: 'Tesla',
        model: 'Model S',
        serviceType: ServiceType.WIPER_BLADES,
        description: SERVICE_DESCRIPTIONS[ServiceType.WIPER_BLADES],
        intervalMiles: SERVICE_INTERVALS[ServiceType.WIPER_BLADES].miles,
        intervalMonths: SERVICE_INTERVALS[ServiceType.WIPER_BLADES].months
      },
      {
        make: 'Tesla',
        model: 'Model S',
        serviceType: ServiceType.BATTERY_REPLACEMENT,
        description: SERVICE_DESCRIPTIONS[ServiceType.BATTERY_REPLACEMENT],
        intervalMiles: 100000, // EVs have longer battery life
        intervalMonths: 60
      }
    );
    
    await ServiceSchedule.bulkCreate(serviceSchedules);
    
    const response: ApiResponse<ResetResponse> = {
      success: true,
      data: {
        success: true,
        customersCreated: customers.length,
        vehiclesCreated: vehicles.length,
        mileageLogsCreated: mileageLogs.length,
        serviceSchedulesCreated: serviceSchedules.length
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error resetting database:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to reset database'
    };
    res.status(500).json(response);
  }
};
