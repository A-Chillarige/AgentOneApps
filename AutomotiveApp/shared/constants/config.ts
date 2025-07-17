/**
 * Configuration constants for the Automotive Service Reminder Agent
 */

import { EnvironmentConfig } from '../types/common';

// Default environment configuration
export const DEFAULT_CONFIG: EnvironmentConfig = {
  database: {
    type: 'sqlite',
    database: 'automotive_service.sqlite'
  },
  notifications: {
    email: {
      enabled: true,
      service: 'nodemailer',
      fromEmail: 'service@automotivereminder.com'
    },
    sms: {
      enabled: true,
      fromPhone: '+15551234567'
    }
  },
  reminderAgent: {
    runInterval: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    upcomingMileageThreshold: 500,    // 500 miles
    upcomingDaysThreshold: 30         // 30 days
  }
};

// Color palette
export const COLOR_PALETTE = {
  NAVY_BLUE: '#0f4c81',
  OFF_WHITE: '#f5f5f5',
  GOLD: '#fdbc3d',
  FOREST_GREEN: '#2e8b57',
  DANGER_RED: '#dc3545',
  WARNING_YELLOW: '#ffc107',
  SUCCESS_GREEN: '#28a745',
  INFO_BLUE: '#17a2b8',
  LIGHT_GRAY: '#e9ecef',
  DARK_GRAY: '#343a40'
};

// API endpoints
export const API_ENDPOINTS = {
  VEHICLES: '/api/vehicles',
  MILEAGE: '/api/mileage',
  REMINDERS: '/api/reminders',
  NOTIFY: '/api/notify',
  RESET: '/api/settings/reset'
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// Date format options
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  ISO: 'YYYY-MM-DD',
  DATETIME: 'MMM DD, YYYY HH:mm',
  TIME: 'HH:mm'
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme'
};
