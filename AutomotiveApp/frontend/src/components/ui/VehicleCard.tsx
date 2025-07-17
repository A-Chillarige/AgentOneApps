import React from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../../../../shared/types/models';
import { formatVehicleName } from '../../../../shared/utils/formatters';

interface VehicleCardProps {
  vehicle: Vehicle;
  nextService?: {
    type: string;
    dueInMiles: number;
    dueInDays: number;
  };
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, nextService }) => {
  // Determine service urgency
  const getUrgencyColor = () => {
    if (!nextService) return 'bg-green-100 text-green-800'; // No upcoming service
    
    if (nextService.dueInMiles <= 0 || nextService.dueInDays <= 0) {
      return 'bg-red-100 text-red-800'; // Overdue
    }
    
    if (nextService.dueInMiles <= 200 || nextService.dueInDays <= 7) {
      return 'bg-red-50 text-red-600'; // Very soon
    }
    
    if (nextService.dueInMiles <= 500 || nextService.dueInDays <= 30) {
      return 'bg-yellow-100 text-yellow-800'; // Upcoming
    }
    
    return 'bg-green-100 text-green-800'; // Not urgent
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-navy-blue">
              {formatVehicleName(vehicle.year, vehicle.make, vehicle.model)}
            </h3>
            <p className="text-sm text-gray-500">VIN: {vehicle.vin}</p>
          </div>
          <Link
            to={`/vehicles/${vehicle.id}`}
            className="text-navy-blue hover:text-gold"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {nextService ? (
          <div className={`mt-4 p-3 rounded-md ${getUrgencyColor()}`}>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{nextService.type}</h4>
                <div className="text-sm mt-1">
                  <p>
                    Due in {nextService.dueInMiles} miles or {nextService.dueInDays} days
                  </p>
                </div>
              </div>
              <svg
                className="w-8 h-8"
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
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-md bg-green-100 text-green-800">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">No upcoming services</h4>
                <p className="text-sm mt-1">Vehicle is up to date</p>
              </div>
              <svg
                className="w-8 h-8"
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
