/**
 * Routes index for the Automotive Service Reminder Agent
 */

import vehicleRoutes from './vehicleRoutes';
import mileageRoutes from './mileageRoutes';
import reminderRoutes from './reminderRoutes';
import notificationRoutes from './notificationRoutes';
import settingsRoutes from './settingsRoutes';
import { API_ENDPOINTS } from '../../../shared/constants/config';

export default {
  vehicleRoutes: {
    path: API_ENDPOINTS.VEHICLES,
    router: vehicleRoutes
  },
  mileageRoutes: {
    path: API_ENDPOINTS.MILEAGE,
    router: mileageRoutes
  },
  reminderRoutes: {
    path: API_ENDPOINTS.REMINDERS,
    router: reminderRoutes
  },
  notificationRoutes: {
    path: API_ENDPOINTS.NOTIFY,
    router: notificationRoutes
  },
  settingsRoutes: {
    path: API_ENDPOINTS.RESET,
    router: settingsRoutes
  }
};
