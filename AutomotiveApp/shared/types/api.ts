/**
 * Shared API interfaces for the Automotive Service Reminder Agent
 */

import { Vehicle, MileageLog, Customer, Reminder } from './models';

// Request interfaces
export interface GetVehiclesRequest {
  customerId?: number;
}

export interface LogMileageRequest {
  vehicleId: number;
  mileage: number;
  loggedAt?: Date; // If not provided, current date will be used
}

export interface GetRemindersRequest {
  customerId?: number;
  vehicleId?: number;
}

export interface NotifyRequest {
  reminderIds: number[];
  notificationTypes?: ('email' | 'sms' | 'calendar')[];
}

// Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GetVehiclesResponse {
  vehicles: Vehicle[];
  total: number;
}

export interface LogMileageResponse {
  mileageLog: MileageLog;
  vehicle: Vehicle;
  upcomingServices?: Array<{
    type: string;
    dueInMiles: number;
    dueInDays: number;
  }>;
}

export interface GetRemindersResponse {
  reminders: Reminder[];
  total: number;
}

export interface NotifyResponse {
  notificationsSent: number;
  successful: {
    email?: string[];
    sms?: string[];
    calendar?: string[];
  };
  failed: {
    email?: string[];
    sms?: string[];
    calendar?: string[];
  };
}

export interface ResetResponse {
  success: boolean;
  customersCreated: number;
  vehiclesCreated: number;
  mileageLogsCreated: number;
  serviceSchedulesCreated: number;
}
