/**
 * Date utility functions for the Automotive Service Reminder Agent
 */

import { DATE_FORMATS } from '../constants/config';

/**
 * Format a date according to the specified format
 * @param date The date to format
 * @param format The format to use (from DATE_FORMATS)
 * @returns Formatted date string
 */
export const formatDate = (date: Date, format: string = DATE_FORMATS.DISPLAY): string => {
  // This is a simple implementation. In a real app, you might use a library like date-fns or moment.js
  const options: Intl.DateTimeFormatOptions = {};
  
  if (format === DATE_FORMATS.DISPLAY) {
    options.year = 'numeric';
    options.month = 'short';
    options.day = 'numeric';
  } else if (format === DATE_FORMATS.ISO) {
    return date.toISOString().split('T')[0];
  } else if (format === DATE_FORMATS.DATETIME) {
    options.year = 'numeric';
    options.month = 'short';
    options.day = 'numeric';
    options.hour = '2-digit';
    options.minute = '2-digit';
  } else if (format === DATE_FORMATS.TIME) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Calculate the difference in days between two dates
 * @param date1 First date
 * @param date2 Second date
 * @returns Number of days between the dates
 */
export const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.round(diffTime / oneDay);
};

/**
 * Calculate the date that is a certain number of days from now
 * @param days Number of days from now
 * @returns Date object
 */
export const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

/**
 * Calculate the date that is a certain number of months from now
 * @param months Number of months from now
 * @returns Date object
 */
export const monthsFromNow = (months: number): Date => {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
};

/**
 * Check if a service is due based on the last service date and interval
 * @param lastServiceDate Date of the last service
 * @param intervalMonths Interval in months
 * @returns Whether the service is due
 */
export const isServiceDueByDate = (
  lastServiceDate: Date,
  intervalMonths: number
): boolean => {
  const nextDueDate = new Date(lastServiceDate);
  nextDueDate.setMonth(nextDueDate.getMonth() + intervalMonths);
  return new Date() >= nextDueDate;
};

/**
 * Calculate days until a service is due
 * @param lastServiceDate Date of the last service
 * @param intervalMonths Interval in months
 * @returns Number of days until the service is due (negative if overdue)
 */
export const daysUntilServiceDue = (
  lastServiceDate: Date,
  intervalMonths: number
): number => {
  const nextDueDate = new Date(lastServiceDate);
  nextDueDate.setMonth(nextDueDate.getMonth() + intervalMonths);
  const today = new Date();
  const diffTime = nextDueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
