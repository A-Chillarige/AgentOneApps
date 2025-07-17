import React, { useState } from 'react';

interface SettingsPanelProps {
  onResetDatabase: () => Promise<void>;
  isLoading?: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onResetDatabase,
  isLoading = false,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    try {
      setError(null);
      setResetSuccess(false);
      await onResetDatabase();
      setShowConfirmation(false);
      setResetSuccess(true);
    } catch (err) {
      setError('Failed to reset database. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-navy-blue">
          Application Settings
        </h3>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-2">
            Database Management
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Reset the database to its initial state with sample data. This will delete all
            existing data and cannot be undone.
          </p>

          {!showConfirmation ? (
            <button
              onClick={() => setShowConfirmation(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Reset Database
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h5 className="text-sm font-medium text-red-800 mb-2">
                Are you sure you want to reset the database?
              </h5>
              <p className="text-sm text-red-600 mb-4">
                This action will delete all vehicles, customers, mileage logs, and service
                schedules. Sample data will be loaded instead.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {isLoading ? 'Resetting...' : 'Yes, Reset Database'}
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-blue disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {resetSuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
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
                <span>Database reset successfully with sample data.</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
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
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-2">
            Notification Settings
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Configure how and when service reminders are sent to customers.
          </p>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="email-notifications"
                type="checkbox"
                className="h-4 w-4 text-navy-blue focus:ring-navy-blue border-gray-300 rounded"
                defaultChecked
              />
              <label
                htmlFor="email-notifications"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                Email Notifications
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="sms-notifications"
                type="checkbox"
                className="h-4 w-4 text-navy-blue focus:ring-navy-blue border-gray-300 rounded"
                defaultChecked
              />
              <label
                htmlFor="sms-notifications"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                SMS Notifications
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="calendar-invites"
                type="checkbox"
                className="h-4 w-4 text-navy-blue focus:ring-navy-blue border-gray-300 rounded"
                defaultChecked
              />
              <label
                htmlFor="calendar-invites"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                Calendar Invites
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
