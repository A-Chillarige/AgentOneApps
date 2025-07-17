import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Vehicle, MileageLog } from '../../../shared/types/models';
import { LogMileageRequest } from '../../../shared/types/api';
import api from '../services/api';
import MileageForm from '../components/ui/MileageForm';
import { formatVehicleName } from '../../../shared/utils/formatters';

interface VehicleDetailParams {
  id: string;
}

const VehicleDetail: React.FC = () => {
  const { id } = useParams<VehicleDetailParams>();
  const vehicleId = parseInt(id, 10);

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [mileageLogs, setMileageLogs] = useState<MileageLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch vehicle details
        const vehicleResponse = await api.vehicle.getVehicleById(vehicleId);
        setVehicle(vehicleResponse.vehicle);

        // Fetch mileage history
        const mileageResponse = await api.mileage.getMileageHistory(vehicleId);
        setMileageLogs(mileageResponse.mileageLogs);
      } catch (err) {
        console.error('Error fetching vehicle data:', err);
        setError('Failed to load vehicle data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicleData();
    }
  }, [vehicleId]);

  const handleLogMileage = async (data: LogMileageRequest) => {
    try {
      setSubmitting(true);
      setError(null);
      
      // Submit mileage log
      const response = await api.mileage.logMileage(data);
      
      // Update mileage logs
      setMileageLogs([response.mileageLog, ...mileageLogs]);
      
      // Show success message or update UI as needed
    } catch (err) {
      console.error('Error logging mileage:', err);
      setError('Failed to log mileage. Please try again.');
      throw err; // Re-throw to be caught by the form
    } finally {
      setSubmitting(false);
    }
  };

  const getCurrentMileage = (): number => {
    if (mileageLogs.length === 0) return 0;
    return mileageLogs[0].mileage;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy-blue"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <div className="flex">
            <svg
              className="h-5 w-5 text-red-500 mr-3"
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
            <p>{error}</p>
          </div>
        </div>
        <div className="mt-4">
          <Link
            to="/"
            className="text-navy-blue hover:text-navy-blue-dark"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4">
          <div className="flex">
            <svg
              className="h-5 w-5 text-yellow-500 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p>Vehicle not found</p>
          </div>
        </div>
        <div className="mt-4">
          <Link
            to="/"
            className="text-navy-blue hover:text-navy-blue-dark"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4">
        <Link
          to="/"
          className="text-navy-blue hover:text-navy-blue-dark"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-navy-blue">
            {formatVehicleName(vehicle.year, vehicle.make, vehicle.model)}
          </h1>
          <p className="text-gray-500">VIN: {vehicle.vin}</p>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Details</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Make</p>
                    <p className="font-medium">{vehicle.make}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Model</p>
                    <p className="font-medium">{vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-medium">{vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Mileage</p>
                    <p className="font-medium">{getCurrentMileage()} miles</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <MileageForm
                vehicle={vehicle}
                currentMileage={getCurrentMileage()}
                onSubmit={handleLogMileage}
                isLoading={submitting}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Mileage History</h2>
        </div>

        {mileageLogs.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No mileage logs found for this vehicle.</p>
            <p className="text-sm text-gray-400 mt-1">
              Use the form above to log your first mileage entry.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Mileage
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mileageLogs.map((log, index) => {
                  const prevMileage = index < mileageLogs.length - 1 ? mileageLogs[index + 1].mileage : 0;
                  const mileageDiff = log.mileage - prevMileage;
                  
                  return (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.loggedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.mileage.toLocaleString()} miles
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index < mileageLogs.length - 1 ? (
                          <span className="text-green-600">+{mileageDiff.toLocaleString()} miles</span>
                        ) : (
                          <span className="text-gray-400">Initial reading</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetail;
