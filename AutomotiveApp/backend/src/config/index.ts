/**
 * Configuration for the Automotive Service Reminder Agent backend
 */

import dotenv from 'dotenv';
import path from 'path';
// Import from shared directory using relative path
import { EnvironmentConfig } from '../../../shared/types/common';

// Load environment variables from .env file
dotenv.config();

const config: EnvironmentConfig = {
  database: {
    type: (process.env.DB_TYPE as 'sqlite' | 'mysql') || 'sqlite',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'automotive_service.sqlite'
  },
  notifications: {
    email: {
      enabled: process.env.EMAIL_ENABLED === 'true',
      service: process.env.EMAIL_SERVICE,
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: process.env.EMAIL_FROM
    },
    sms: {
      enabled: process.env.SMS_ENABLED === 'true',
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromPhone: process.env.SMS_FROM
    }
  },
  reminderAgent: {
    runInterval: process.env.REMINDER_INTERVAL 
      ? parseInt(process.env.REMINDER_INTERVAL, 10) 
      : 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    upcomingMileageThreshold: process.env.UPCOMING_MILEAGE_THRESHOLD 
      ? parseInt(process.env.UPCOMING_MILEAGE_THRESHOLD, 10) 
      : 500,
    upcomingDaysThreshold: process.env.UPCOMING_DAYS_THRESHOLD 
      ? parseInt(process.env.UPCOMING_DAYS_THRESHOLD, 10) 
      : 30
  }
};

// Server configuration
export const SERVER_CONFIG = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

// Database configuration
export const DB_CONFIG = {
  type: config.database.type,
  options: {
    storage: config.database.type === 'sqlite' 
      ? path.join(__dirname, '..', '..', config.database.database) 
      : undefined,
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    dialect: config.database.type,
    logging: SERVER_CONFIG.nodeEnv === 'development' ? console.log : false
  }
};

// Notification configuration
export const NOTIFICATION_CONFIG = {
  email: config.notifications.email,
  sms: config.notifications.sms
};

// Reminder agent configuration
export const REMINDER_CONFIG = {
  runInterval: config.reminderAgent.runInterval,
  upcomingMileageThreshold: config.reminderAgent.upcomingMileageThreshold,
  upcomingDaysThreshold: config.reminderAgent.upcomingDaysThreshold
};

export default {
  server: SERVER_CONFIG,
  database: DB_CONFIG,
  notifications: NOTIFICATION_CONFIG,
  reminderAgent: REMINDER_CONFIG
};
