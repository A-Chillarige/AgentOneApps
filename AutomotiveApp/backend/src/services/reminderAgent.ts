/**
 * Reminder agent service for the Automotive Service Reminder Agent
 */

import cron from 'node-cron';
import { Vehicle, Customer, MileageLog, ServiceSchedule } from '../models';
import { REMINDER_CONFIG } from '../config';
import { URGENCY_THRESHOLDS } from '../../../shared/constants/serviceTypes';
import { formatVehicleName } from '../../../shared/utils/formatters';
import { Reminder } from '../../../shared/types/models';
import { NOTIFICATION_TYPES, REMINDER_TEMPLATES } from '../../../shared/constants/reminderTypes';

// Mock email service (in a real app, this would use nodemailer or SendGrid)
const sendEmail = async (
  to: string,
  subject: string,
  body: string
): Promise<boolean> => {
  console.log(`Sending email to ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  
  // Simulate success (90% of the time)
  return Math.random() < 0.9;
};

// Mock SMS service (in a real app, this would use Twilio)
const sendSMS = async (
  to: string,
  body: string
): Promise<boolean> => {
  console.log(`Sending SMS to ${to}`);
  console.log(`Body: ${body}`);
  
  // Simulate success (90% of the time)
  return Math.random() < 0.9;
};

// Mock calendar invite service (in a real app, this would generate an .ics file)
const generateCalendarInvite = async (
  to: string,
  summary: string,
  description: string,
  startDate: Date
): Promise<boolean> => {
  console.log(`Generating calendar invite for ${to}`);
  console.log(`Summary: ${summary}`);
  console.log(`Description: ${description}`);
  console.log(`Start Date: ${startDate}`);
  
  // Simulate success (90% of the time)
  return Math.random() < 0.9;
};

/**
 * Set up the reminder agent to run on a schedule
 */
export const setupReminderAgent = (): void => {
  // Run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running reminder agent...');
    await checkAndSendReminders();
  });
  
  console.log('Reminder agent scheduled to run daily at midnight');
};

/**
 * Check for upcoming services and send reminders
 */
export const checkAndSendReminders = async (): Promise<void> => {
  try {
    // Get all vehicles with their customers and latest mileage logs
    const vehicles = await Vehicle.findAll({
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'phone', 'preferredReminderType', 'timezone']
        },
        {
          model: MileageLog,
          as: 'mileageLogs',
          limit: 1,
          order: [['loggedAt', 'DESC']]
        }
      ]
    });
    
    console.log(`Checking reminders for ${vehicles.length} vehicles`);
    
    let remindersSent = 0;
    
    // Process each vehicle
    for (const vehicle of vehicles) {
      // Skip vehicles with no mileage logs
      if (!vehicle.mileageLogs || vehicle.mileageLogs.length === 0) {
        continue;
      }
      
      const currentMileage = vehicle.mileageLogs[0].mileage;
      const upcomingServices = await calculateUpcomingServices(vehicle, currentMileage);
      
      // Only send reminders if there are upcoming services
      if (upcomingServices.length > 0) {
        const vehicleName = formatVehicleName(vehicle.year, vehicle.make, vehicle.model);
        const customer = vehicle.customer;
        
        // Create reminder object
        const reminder: Reminder = {
          customer: customer.name,
          vehicle: vehicleName,
          upcomingServices,
          actions: {
            emailSent: false,
            smsSent: false,
            calendarInviteAttached: false
          }
        };
        
        // Send email notification
        if (customer.preferredReminderType === 'email' || customer.preferredReminderType === 'both') {
          // Format email content
          const subject = REMINDER_TEMPLATES.EMAIL.SUBJECT.replace('{vehicle}', vehicleName);
          
          let servicesText = '';
          upcomingServices.forEach(service => {
            servicesText += `- ${service.type}: Due in ${service.dueInMiles} miles or ${service.dueInDays} days\n`;
          });
          
          const body = REMINDER_TEMPLATES.EMAIL.BODY
            .replace('{customer}', customer.name)
            .replace('{vehicle}', vehicleName)
            .replace('{services}', servicesText);
          
          // Send email
          const emailSuccess = await sendEmail(customer.email, subject, body);
          
          if (emailSuccess) {
            reminder.actions.emailSent = true;
            remindersSent++;
          }
        }
        
        // Send SMS notification
        if (customer.preferredReminderType === 'sms' || customer.preferredReminderType === 'both') {
          // Format SMS content
          const serviceCount = upcomingServices.length;
          const earliestService = upcomingServices[0]; // Already sorted by urgency
          const dueTime = earliestService.dueInDays <= 7 
            ? `in ${earliestService.dueInDays} days` 
            : `in ${Math.ceil(earliestService.dueInDays / 7)} weeks`;
          
          const body = REMINDER_TEMPLATES.SMS.BODY
            .replace('{vehicle}', vehicleName)
            .replace('{serviceCount}', serviceCount.toString())
            .replace('{dueTime}', dueTime);
          
          // Send SMS
          const smsSuccess = await sendSMS(customer.phone, body);
          
          if (smsSuccess) {
            reminder.actions.smsSent = true;
            remindersSent++;
          }
        }
        
        // Generate calendar invite for the most urgent service
        const earliestService = upcomingServices[0]; // Already sorted by urgency
        if (earliestService.dueInDays <= 14) { // Only send calendar invites for services due within 2 weeks
          // Format calendar invite content
          const summary = REMINDER_TEMPLATES.CALENDAR.SUMMARY.replace('{vehicle}', vehicleName);
          
          let servicesText = '';
          upcomingServices.forEach(service => {
            servicesText += `- ${service.type}: Due in ${service.dueInMiles} miles or ${service.dueInDays} days\n`;
          });
          
          const description = REMINDER_TEMPLATES.CALENDAR.DESCRIPTION
            .replace('{vehicle}', vehicleName)
            .replace('{services}', servicesText);
          
          // Calculate suggested appointment date (earliest service due date)
          const suggestedDate = new Date();
          suggestedDate.setDate(suggestedDate.getDate() + Math.max(1, earliestService.dueInDays - 7)); // 7 days before due
          
          // Generate calendar invite
          const calendarSuccess = await generateCalendarInvite(customer.email, summary, description, suggestedDate);
          
          if (calendarSuccess) {
            reminder.actions.calendarInviteAttached = true;
            remindersSent++;
          }
        }
        
        console.log(`Sent reminders for ${vehicleName} to ${customer.name}`);
      }
    }
    
    console.log(`Reminder agent completed. Sent ${remindersSent} reminders.`);
  } catch (error) {
    console.error('Error in reminder agent:', error);
  }
};

/**
 * Calculate upcoming services for a vehicle based on current mileage
 * @param vehicle The vehicle to calculate services for
 * @param currentMileage The current mileage of the vehicle
 * @returns Array of upcoming services
 */
const calculateUpcomingServices = async (
  vehicle: any,
  currentMileage: number
): Promise<Array<{ type: string; dueInMiles: number; dueInDays: number }>> => {
  // Get the last mileage log to calculate average daily mileage
  const mileageLogs = await MileageLog.findAll({
    where: { vehicleId: vehicle.id },
    order: [['loggedAt', 'DESC']],
    limit: 2
  });
  
  // If we have at least 2 logs, calculate average daily mileage
  let avgDailyMileage = 30; // Default to 30 miles per day
  if (mileageLogs.length >= 2) {
    const latestLog = mileageLogs[0];
    const previousLog = mileageLogs[1];
    const daysBetween = Math.max(1, Math.round(
      (latestLog.loggedAt.getTime() - previousLog.loggedAt.getTime()) / (1000 * 60 * 60 * 24)
    ));
    avgDailyMileage = Math.round((latestLog.mileage - previousLog.mileage) / daysBetween);
    avgDailyMileage = Math.max(1, avgDailyMileage); // Ensure at least 1 mile per day
  }
  
  // Get service schedules for this vehicle's make and model
  const serviceSchedules = await ServiceSchedule.findAll({
    where: {
      make: vehicle.make,
      model: vehicle.model
    }
  });
  
  // Calculate upcoming services
  const upcomingServices = [];
  
  for (const schedule of serviceSchedules) {
    // Calculate miles until next service
    const milesSinceLastService = currentMileage % schedule.intervalMiles;
    const milesUntilService = schedule.intervalMiles - milesSinceLastService;
    
    // Calculate days until next service based on average daily mileage
    const daysUntilService = Math.round(milesUntilService / avgDailyMileage);
    
    // Check if service is due within the threshold
    if (milesUntilService <= URGENCY_THRESHOLDS.MILES.UPCOMING || daysUntilService <= URGENCY_THRESHOLDS.DAYS.UPCOMING) {
      upcomingServices.push({
        type: schedule.serviceType,
        dueInMiles: milesUntilService,
        dueInDays: daysUntilService
      });
    }
  }
  
  // Sort by urgency (miles due)
  upcomingServices.sort((a, b) => a.dueInMiles - b.dueInMiles);
  
  return upcomingServices;
};
