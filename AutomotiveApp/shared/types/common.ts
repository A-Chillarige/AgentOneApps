/**
 * Common shared types for the Automotive Service Reminder Agent
 */

// Notification types
export type NotificationType = 'email' | 'sms' | 'calendar';

// Service urgency levels
export enum ServiceUrgency {
  OVERDUE = 'overdue',
  UPCOMING = 'upcoming',
  OK = 'ok'
}

// Service type
export enum ServiceType {
  OIL_CHANGE = 'Oil Change',
  TIRE_ROTATION = 'Tire Rotation',
  BRAKE_INSPECTION = 'Brake Inspection',
  AIR_FILTER = 'Air Filter Replacement',
  TRANSMISSION_FLUID = 'Transmission Fluid Change',
  COOLANT_FLUSH = 'Coolant System Flush',
  SPARK_PLUGS = 'Spark Plugs Replacement',
  TIMING_BELT = 'Timing Belt Replacement',
  BATTERY_REPLACEMENT = 'Battery Replacement',
  WIPER_BLADES = 'Wiper Blades Replacement'
}

// Environment configuration
export interface EnvironmentConfig {
  database: {
    type: 'sqlite' | 'mysql';
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database: string;
  };
  notifications: {
    email: {
      enabled: boolean;
      service?: string;
      apiKey?: string;
      fromEmail?: string;
    };
    sms: {
      enabled: boolean;
      accountSid?: string;
      authToken?: string;
      fromPhone?: string;
    };
  };
  reminderAgent: {
    runInterval: number; // in milliseconds
    upcomingMileageThreshold: number; // in miles
    upcomingDaysThreshold: number; // in days
  };
}

// Pagination parameters
export interface PaginationParams {
  page: number;
  limit: number;
}

// Sort parameters
export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}
