/**
 * Reminder type definitions for the Automotive Service Reminder Agent
 */

import { NotificationType } from '../types/common';

// Reminder notification types
export const NOTIFICATION_TYPES: NotificationType[] = ['email', 'sms', 'calendar'];

// Reminder templates for different notification types
export const REMINDER_TEMPLATES = {
  EMAIL: {
    SUBJECT: 'Vehicle Service Reminder: {vehicle}',
    BODY: `
Dear {customer},

Your {vehicle} is due for the following service(s):

{services}

Please contact us to schedule an appointment at your earliest convenience.

Thank you for choosing our service center!

Best regards,
Automotive Service Center
    `
  },
  SMS: {
    BODY: 'Reminder: Your {vehicle} is due for {serviceCount} service(s) {dueTime}. Please call us to schedule an appointment.'
  },
  CALENDAR: {
    SUMMARY: '{vehicle} Service Appointment',
    DESCRIPTION: `
Vehicle: {vehicle}
Services Due:
{services}

Please contact our service center to confirm this appointment time.
    `
  }
};

// Reminder frequency settings (in days)
export const REMINDER_FREQUENCY = {
  FIRST_REMINDER: 30, // First reminder 30 days before due
  FOLLOW_UP: 7,       // Follow-up reminders every 7 days
  MAX_REMINDERS: 3    // Maximum number of reminders to send
};

// Reminder priority levels
export enum ReminderPriority {
  HIGH = 'high',       // Overdue services
  MEDIUM = 'medium',   // Due within 7 days or 100 miles
  LOW = 'low'          // Due within 30 days or 500 miles
}

// Reminder status
export enum ReminderStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  ACKNOWLEDGED = 'acknowledged',
  COMPLETED = 'completed'
}
