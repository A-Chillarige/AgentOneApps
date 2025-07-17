/**
 * Service type definitions for the Automotive Service Reminder Agent
 */

import { ServiceType } from '../types/common';

// Default service intervals by service type (in miles and months)
export const SERVICE_INTERVALS = {
  [ServiceType.OIL_CHANGE]: {
    miles: 5000,
    months: 6
  },
  [ServiceType.TIRE_ROTATION]: {
    miles: 10000,
    months: 12
  },
  [ServiceType.BRAKE_INSPECTION]: {
    miles: 15000,
    months: 12
  },
  [ServiceType.AIR_FILTER]: {
    miles: 15000,
    months: 12
  },
  [ServiceType.TRANSMISSION_FLUID]: {
    miles: 30000,
    months: 24
  },
  [ServiceType.COOLANT_FLUSH]: {
    miles: 30000,
    months: 24
  },
  [ServiceType.SPARK_PLUGS]: {
    miles: 60000,
    months: 36
  },
  [ServiceType.TIMING_BELT]: {
    miles: 90000,
    months: 60
  },
  [ServiceType.BATTERY_REPLACEMENT]: {
    miles: 50000,
    months: 36
  },
  [ServiceType.WIPER_BLADES]: {
    miles: 15000,
    months: 12
  }
};

// Service descriptions
export const SERVICE_DESCRIPTIONS = {
  [ServiceType.OIL_CHANGE]: 'Replace engine oil and filter to maintain engine performance and longevity.',
  [ServiceType.TIRE_ROTATION]: 'Rotate tires to ensure even wear and extend tire life.',
  [ServiceType.BRAKE_INSPECTION]: 'Inspect brake pads, rotors, and fluid to ensure safe stopping performance.',
  [ServiceType.AIR_FILTER]: 'Replace air filter to maintain engine efficiency and performance.',
  [ServiceType.TRANSMISSION_FLUID]: 'Replace transmission fluid to maintain smooth gear shifting and extend transmission life.',
  [ServiceType.COOLANT_FLUSH]: 'Flush and replace coolant to prevent overheating and protect engine components.',
  [ServiceType.SPARK_PLUGS]: 'Replace spark plugs to maintain engine performance and fuel efficiency.',
  [ServiceType.TIMING_BELT]: 'Replace timing belt to prevent engine damage and maintain proper engine timing.',
  [ServiceType.BATTERY_REPLACEMENT]: 'Replace battery to ensure reliable starting and electrical system performance.',
  [ServiceType.WIPER_BLADES]: 'Replace wiper blades to maintain visibility during inclement weather.'
};

// Service urgency thresholds
export const URGENCY_THRESHOLDS = {
  MILES: {
    UPCOMING: 500, // Service due within 500 miles
    OVERDUE: 0     // Service overdue (negative miles remaining)
  },
  DAYS: {
    UPCOMING: 30,  // Service due within 30 days
    OVERDUE: 0     // Service overdue (negative days remaining)
  }
};

// All available service types as an array
export const ALL_SERVICE_TYPES = Object.values(ServiceType);
