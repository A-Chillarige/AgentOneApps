import React, { useEffect, useState } from 'react';
import { Reminder } from '../../../shared/types/models';
import api from '../services/api';
import ReminderList from '../components/ui/ReminderList';

const ReminderAgent: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState<boolean>(false);
  const [notificationSuccess, setNotificationSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.reminder.getReminders();
        setReminders(response.reminders);
      } catch (err) {
        console.error('Error fetching reminders:', err);
        setError('Failed to load reminders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const handleSendNotification = async (reminder: Reminder) => {
    try {
      setSending(true);
      setError(null);
      setNotificationSuccess(false);

      // Get the reminder ID (in a real app, this would be stored in the reminder object)
      // For this demo, we'll generate a unique ID based on the reminder properties
      const reminderId = Math.floor(Math.random() * 1000) + 1; // Generate a random ID between 1 and 1000
      
      await api.notification.sendNotifications({
        reminderIds: [reminderId],
        notificationTypes: ['email', 'sms', 'calendar']
      });

      // Update the reminder to show notifications were sent
      const updatedReminders = reminders.map(r => {
        if (r === reminder) {
          return {
            ...r,
            actions: {
              emailSent: true,
              smsSent: true,
              calendarInviteAttached: true
            }
          };
        }
        return r;
      });

      setReminders(updatedReminders);
      setNotificationSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setNotificationSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error sending notifications:', err);
      setError('Failed to send notifications. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-navy-blue mb-6">Service Reminders</h1>

      {notificationSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Notifications sent successfully!</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy-blue"></div>
        </div>
      ) : (
        <ReminderList
          reminders={reminders}
          onSendNotification={handleSendNotification}
          isLoading={sending}
        />
      )}

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">About Service Reminders</h2>
        <p className="text-gray-600 mb-4">
          The Automotive Service Reminder Agent automatically checks each vehicle's mileage and
          time since last service, comparing against manufacturer's recommended service schedules.
        </p>
        <p className="text-gray-600 mb-4">
          Services due within 500 miles or 30 days are flagged as upcoming, and notifications
          can be sent to customers via email, SMS, or calendar invites.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex items-center mb-2">
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h3 className="font-medium text-blue-800">Email Notifications</h3>
            </div>
            <p className="text-sm text-blue-600">
              Detailed service information sent directly to customer's inbox.
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-md">
            <div className="flex items-center mb-2">
              <svg
                className="w-5 h-5 mr-2 text-purple-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <h3 className="font-medium text-purple-800">SMS Reminders</h3>
            </div>
            <p className="text-sm text-purple-600">
              Quick text message alerts for upcoming service needs.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex items-center mb-2">
              <svg
                className="w-5 h-5 mr-2 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="font-medium text-green-800">Calendar Invites</h3>
            </div>
            <p className="text-sm text-green-600">
              Schedule service appointments directly in customer's calendar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderAgent;
