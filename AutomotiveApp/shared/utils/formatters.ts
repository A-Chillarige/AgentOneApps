/**
 * Formatting utility functions for the Automotive Service Reminder Agent
 */

import { ServiceUrgency } from '../types/common';
import { URGENCY_THRESHOLDS } from '../constants/serviceTypes';

/**
 * Format a mileage number with commas and 'mi' suffix
 * @param mileage The mileage to format
 * @returns Formatted mileage string
 */
export const formatMileage = (mileage: number): string => {
  return `${mileage.toLocaleString()} mi`;
};

/**
 * Format a VIN with proper spacing
 * @param vin The VIN to format
 * @returns Formatted VIN string
 */
export const formatVin = (vin: string): string => {
  if (!vin) return '';
  // Format as XXX-XXXXXXX-XXXXXXX
  return `${vin.slice(0, 3)}-${vin.slice(3, 10)}-${vin.slice(10)}`;
};

/**
 * Format a phone number
 * @param phone The phone number to format
 * @returns Formatted phone number
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // If it doesn't match expected formats, return as is
  return phone;
};

/**
 * Format a vehicle name (year make model)
 * @param year Vehicle year
 * @param make Vehicle make
 * @param model Vehicle model
 * @returns Formatted vehicle name
 */
export const formatVehicleName = (year: number, make: string, model: string): string => {
  return `${year} ${make} ${model}`;
};

/**
 * Format a service due message based on miles and days
 * @param dueInMiles Miles until service is due
 * @param dueInDays Days until service is due
 * @returns Formatted service due message
 */
export const formatServiceDue = (dueInMiles: number, dueInDays: number): string => {
  if (dueInMiles <= 0 || dueInDays <= 0) {
    return 'Overdue';
  }
  
  if (dueInMiles < 100) {
    return `Due in ${dueInMiles} miles`;
  }
  
  if (dueInDays < 7) {
    return `Due in ${dueInDays} days`;
  }
  
  if (dueInDays < 30) {
    return `Due in ${Math.floor(dueInDays / 7)} weeks`;
  }
  
  return `Due in ${Math.floor(dueInDays / 30)} months`;
};

/**
 * Determine service urgency based on miles and days
 * @param dueInMiles Miles until service is due
 * @param dueInDays Days until service is due
 * @returns Service urgency level
 */
export const getServiceUrgency = (dueInMiles: number, dueInDays: number): ServiceUrgency => {
  if (dueInMiles <= URGENCY_THRESHOLDS.MILES.OVERDUE || dueInDays <= URGENCY_THRESHOLDS.DAYS.OVERDUE) {
    return ServiceUrgency.OVERDUE;
  }
  
  if (dueInMiles <= URGENCY_THRESHOLDS.MILES.UPCOMING || dueInDays <= URGENCY_THRESHOLDS.DAYS.UPCOMING) {
    return ServiceUrgency.UPCOMING;
  }
  
  return ServiceUrgency.OK;
};

/**
 * Get color for service urgency
 * @param urgency Service urgency level
 * @returns CSS color code
 */
export const getUrgencyColor = (urgency: ServiceUrgency): string => {
  switch (urgency) {
    case ServiceUrgency.OVERDUE:
      return '#dc3545'; // Danger red
    case ServiceUrgency.UPCOMING:
      return '#ffc107'; // Warning yellow
    case ServiceUrgency.OK:
      return '#28a745'; // Success green
    default:
      return '#6c757d'; // Secondary gray
  }
};

/**
 * Format a reminder message for display
 * @param reminder The reminder object
 * @returns Formatted reminder message
 */
export const formatReminderMessage = (
  serviceType: string,
  dueInMiles: number,
  dueInDays: number
): string => {
  const urgency = getServiceUrgency(dueInMiles, dueInDays);
  const urgencyText = urgency === ServiceUrgency.OVERDUE ? 'OVERDUE' : 
                     urgency === ServiceUrgency.UPCOMING ? 'UPCOMING' : '';
  
  let message = `${serviceType}`;
  
  if (urgencyText) {
    message += ` (${urgencyText})`;
  }
  
  message += `: ${formatServiceDue(dueInMiles, dueInDays)}`;
  
  return message;
};
