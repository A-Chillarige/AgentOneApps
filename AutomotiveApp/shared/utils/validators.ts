/**
 * Validation utility functions for the Automotive Service Reminder Agent
 */

/**
 * Validate a VIN (Vehicle Identification Number)
 * @param vin The VIN to validate
 * @returns Whether the VIN is valid
 */
export const isValidVin = (vin: string): boolean => {
  // Basic VIN validation: 17 alphanumeric characters, excluding I, O, and Q
  if (!vin || vin.length !== 17) {
    return false;
  }
  
  // VIN should only contain alphanumeric characters
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vinRegex.test(vin);
};

/**
 * Validate an email address
 * @param email The email to validate
 * @returns Whether the email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a phone number
 * @param phone The phone number to validate
 * @returns Whether the phone number is valid
 */
export const isValidPhone = (phone: string): boolean => {
  // Basic phone validation: 10+ digits, may include +, -, (), and spaces
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate a year
 * @param year The year to validate
 * @returns Whether the year is valid
 */
export const isValidYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear + 1; // Allow current year + 1 for new models
};

/**
 * Validate mileage
 * @param mileage The mileage to validate
 * @returns Whether the mileage is valid
 */
export const isValidMileage = (mileage: number): boolean => {
  return mileage >= 0 && mileage <= 1000000; // Reasonable upper limit
};

/**
 * Validate a timezone
 * @param timezone The timezone to validate
 * @returns Whether the timezone is valid
 */
export const isValidTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Sanitize a string by removing HTML tags and trimming
 * @param str The string to sanitize
 * @returns The sanitized string
 */
export const sanitizeString = (str: string): string => {
  if (!str) return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
};

/**
 * Validate that a value is not empty
 * @param value The value to check
 * @returns Whether the value is not empty
 */
export const isNotEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};
