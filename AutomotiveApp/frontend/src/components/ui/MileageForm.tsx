import React, { useState } from 'react';
import { Vehicle } from '../../../../shared/types/models';
import { LogMileageRequest } from '../../../../shared/types/api';
import { isValidMileage } from '../../../../shared/utils/validators';
import { formatVehicleName } from '../../../../shared/utils/formatters';

interface MileageFormProps {
  vehicle: Vehicle;
  currentMileage?: number;
  onSubmit: (data: LogMileageRequest) => Promise<void>;
  isLoading?: boolean;
}

const MileageForm: React.FC<MileageFormProps> = ({
  vehicle,
  currentMileage = 0,
  onSubmit,
  isLoading = false,
}) => {
  const [mileage, setMileage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate mileage
    const mileageValue = parseInt(mileage, 10);
    
    if (!mileage || isNaN(mileageValue)) {
      setError('Please enter a valid mileage value');
      return;
    }
    
    if (!isValidMileage(mileageValue)) {
      setError('Mileage must be a positive number');
      return;
    }
    
    if (mileageValue <= currentMileage) {
      setError(`New mileage must be greater than current mileage (${currentMileage})`);
      return;
    }
    
    // Clear error
    setError('');
    
    // Submit form
    try {
      await onSubmit({
        vehicleId: vehicle.id!,
        mileage: mileageValue,
      });
      
      // Clear form
      setMileage('');
    } catch (err) {
      setError('Failed to log mileage. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-navy-blue mb-4">
        Log Mileage for {formatVehicleName(vehicle.year, vehicle.make, vehicle.model)}
      </h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Current mileage: <span className="font-medium">{currentMileage} miles</span>
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">
            New Mileage
          </label>
          <div className="flex">
            <input
              type="number"
              id="mileage"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-navy-blue focus:ring focus:ring-navy-blue focus:ring-opacity-50"
              placeholder="Enter current mileage"
              min={currentMileage + 1}
              required
            />
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
              miles
            </span>
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-navy-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-blue disabled:opacity-50"
          >
            {isLoading ? 'Logging...' : 'Log Mileage'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MileageForm;
