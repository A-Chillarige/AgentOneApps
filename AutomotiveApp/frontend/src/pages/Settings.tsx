import React, { useState } from 'react';
import api from '../services/api';
import SettingsPanel from '../components/ui/SettingsPanel';

const Settings: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleResetDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await api.settings.resetDatabase();
      
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error resetting database:', err);
      setError('Failed to reset database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-navy-blue mb-6">Settings</h1>
      
      {success && (
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
            <span>Database reset successfully!</span>
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
      
      <SettingsPanel
        onResetDatabase={handleResetDatabase}
        isLoading={loading}
      />
    </div>
  );
};

export default Settings;
