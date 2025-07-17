import axios from 'axios';
import { 
  ApiResponse, 
  GetVehiclesResponse, 
  LogMileageRequest, 
  LogMileageResponse, 
  GetRemindersResponse, 
  NotifyRequest, 
  NotifyResponse, 
  ResetResponse 
} from '../../../shared/types/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions for vehicles
export const vehicleApi = {
  // Get all vehicles or filter by customer
  getVehicles: async (customerId?: number): Promise<GetVehiclesResponse> => {
    const params = customerId ? { customerId } : {};
    const response = await api.get<ApiResponse<GetVehiclesResponse>>('/vehicles', { params });
    return response.data.data!;
  },

  // Get a vehicle by ID
  getVehicleById: async (id: number): Promise<any> => {
    const response = await api.get<ApiResponse<any>>(`/vehicles/${id}`);
    return response.data.data!;
  },

  // Create a new vehicle
  createVehicle: async (vehicle: any): Promise<any> => {
    const response = await api.post<ApiResponse<any>>('/vehicles', vehicle);
    return response.data.data!;
  },

  // Update a vehicle
  updateVehicle: async (id: number, vehicle: any): Promise<any> => {
    const response = await api.put<ApiResponse<any>>(`/vehicles/${id}`, vehicle);
    return response.data.data!;
  },

  // Delete a vehicle
  deleteVehicle: async (id: number): Promise<any> => {
    const response = await api.delete<ApiResponse<any>>(`/vehicles/${id}`);
    return response.data.data!;
  },
};

// API functions for mileage logs
export const mileageApi = {
  // Log a new mileage entry
  logMileage: async (data: LogMileageRequest): Promise<LogMileageResponse> => {
    const response = await api.post<ApiResponse<LogMileageResponse>>('/mileage', data);
    return response.data.data!;
  },

  // Get mileage history for a vehicle
  getMileageHistory: async (vehicleId: number): Promise<any> => {
    const response = await api.get<ApiResponse<any>>(`/mileage/${vehicleId}`);
    return response.data.data!;
  },

  // Update a mileage log
  updateMileageLog: async (id: number, data: any): Promise<any> => {
    const response = await api.put<ApiResponse<any>>(`/mileage/${id}`, data);
    return response.data.data!;
  },

  // Delete a mileage log
  deleteMileageLog: async (id: number): Promise<any> => {
    const response = await api.delete<ApiResponse<any>>(`/mileage/${id}`);
    return response.data.data!;
  },
};

// API functions for reminders
export const reminderApi = {
  // Get all reminders or filter by customer or vehicle
  getReminders: async (customerId?: number, vehicleId?: number): Promise<GetRemindersResponse> => {
    const params = { ...(customerId && { customerId }), ...(vehicleId && { vehicleId }) };
    const response = await api.get<ApiResponse<GetRemindersResponse>>('/reminders', { params });
    return response.data.data!;
  },

  // Get reminders for a specific vehicle
  getVehicleReminders: async (vehicleId: number): Promise<GetRemindersResponse> => {
    const response = await api.get<ApiResponse<GetRemindersResponse>>(`/reminders/vehicle/${vehicleId}`);
    return response.data.data!;
  },

  // Get reminders for a specific customer
  getCustomerReminders: async (customerId: number): Promise<GetRemindersResponse> => {
    const response = await api.get<ApiResponse<GetRemindersResponse>>(`/reminders/customer/${customerId}`);
    return response.data.data!;
  },
};

// API functions for notifications
export const notificationApi = {
  // Send notifications
  sendNotifications: async (data: NotifyRequest): Promise<NotifyResponse> => {
    const response = await api.post<ApiResponse<NotifyResponse>>('/notify', data);
    return response.data.data!;
  },
};

// API functions for settings
export const settingsApi = {
  // Reset database and load seed data
  resetDatabase: async (): Promise<ResetResponse> => {
    const response = await api.post<ApiResponse<ResetResponse>>('/settings/reset');
    return response.data.data!;
  },
};

// Export all API functions
export default {
  vehicle: vehicleApi,
  mileage: mileageApi,
  reminder: reminderApi,
  notification: notificationApi,
  settings: settingsApi,
};
