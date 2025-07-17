/**
 * Shared model interfaces for the Automotive Service Reminder Agent
 */

export interface Vehicle {
  id?: number;
  vin: string;
  make: string;
  model: string;
  year: number;
  customerId: number;
  createdAt?: Date;
  nextService?: {
    type: string;
    dueInMiles: number;
    dueInDays: number;
  };
}

export interface MileageLog {
  id?: number;
  vehicleId: number;
  loggedAt: Date;
  mileage: number;
}

export interface ServiceSchedule {
  id?: number;
  make: string;
  model: string;
  serviceType: string;
  description: string;
  intervalMiles: number;
  intervalMonths: number;
}

export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  preferredReminderType: 'email' | 'sms' | 'both';
  timezone: string;
  createdAt?: Date;
}

export interface Reminder {
  customer: string;
  vehicle: string;
  upcomingServices: Array<{
    type: string;
    dueInMiles: number;
    dueInDays: number;
  }>;
  actions: {
    emailSent: boolean;
    smsSent: boolean;
    calendarInviteAttached: boolean;
  };
}
