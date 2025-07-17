import React from 'react';
import { Reminder } from '../../../../shared/types/models';
import { ServiceUrgency } from '../../../../shared/types/common';

interface ReminderListProps {
  reminders: Reminder[];
  onSendNotification?: (reminder: Reminder) => void;
  isLoading?: boolean;
}

const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  onSendNotification,
  isLoading = false,
}) => {
  // Determine service urgency
  const getUrgencyInfo = (dueInMiles: number, dueInDays: number) => {
    if (dueInMiles <= 0 || dueInDays <= 0) {
      return {
        urgency: ServiceUrgency.OVERDUE,
        color: 'text-red-600 bg-red-100',
        icon: (
          <svg
            className="w-6 h-6 text-red-600"
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
        ),
      };
    }

    if (dueInMiles <= 200 || dueInDays <= 7) {
      return {
        urgency: ServiceUrgency.UPCOMING,
        color: 'text-yellow-600 bg-yellow-100',
        icon: (
          <svg
            className="w-6 h-6 text-yellow-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      };
    }

    return {
      urgency: ServiceUrgency.OK,
      color: 'text-green-600 bg-green-100',
      icon: (
        <svg
          className="w-6 h-6 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    };
  };

  if (reminders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <svg
          className="w-12 h-12 mx-auto text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No reminders</h3>
        <p className="mt-1 text-sm text-gray-500">
          All vehicles are up to date with their maintenance.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-navy-blue">
          Service Reminders
        </h3>
      </div>

      <ul className="divide-y divide-gray-200">
        {reminders.map((reminder, index) => (
          <li key={index} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{reminder.vehicle}</h4>
                <p className="text-sm text-gray-500">Customer: {reminder.customer}</p>
              </div>

              {onSendNotification && (
                <button
                  onClick={() => onSendNotification(reminder)}
                  disabled={isLoading}
                  className="ml-4 px-3 py-1 bg-navy-blue text-white text-sm rounded hover:bg-navy-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-blue disabled:opacity-50"
                >
                  Send Reminder
                </button>
              )}
            </div>

            <div className="mt-3">
              <h5 className="text-sm font-medium text-gray-700 mb-2">
                Upcoming Services:
              </h5>
              <ul className="space-y-2">
                {reminder.upcomingServices.map((service, serviceIndex) => {
                  const { color, icon } = getUrgencyInfo(
                    service.dueInMiles,
                    service.dueInDays
                  );
                  return (
                    <li
                      key={serviceIndex}
                      className={`flex items-center p-2 rounded-md ${color}`}
                    >
                      <div className="mr-2">{icon}</div>
                      <div>
                        <span className="font-medium">{service.type}</span>
                        <span className="ml-2 text-sm">
                          Due in {service.dueInMiles} miles or {service.dueInDays} days
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className={`w-4 h-4 mr-1 ${
                      reminder.actions.emailSent ? 'text-green-500' : 'text-gray-400'
                    }`}
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
                  <span>Email</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className={`w-4 h-4 mr-1 ${
                      reminder.actions.smsSent ? 'text-green-500' : 'text-gray-400'
                    }`}
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
                  <span>SMS</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className={`w-4 h-4 mr-1 ${
                      reminder.actions.calendarInviteAttached
                        ? 'text-green-500'
                        : 'text-gray-400'
                    }`}
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
                  <span>Calendar</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReminderList;
