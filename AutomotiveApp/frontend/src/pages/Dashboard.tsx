import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../../../shared/types/models';
import api from '../services/api';
import VehicleCard from '../components/ui/VehicleCard';

const Dashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.vehicle.getVehicles();
        setVehicles(response.vehicles);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy-blue">Dashboard</h1>
        <Link
          to="/reminders"
          className="px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-navy-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-blue"
        >
          View All Reminders
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy-blue"></div>
        </div>
      ) : error ? (
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
      ) : vehicles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-gray-900">No vehicles found</h2>
          <p className="mt-2 text-gray-500">
            Add a vehicle to start tracking maintenance schedules.
          </p>
          <div className="mt-6">
            <button className="px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-navy-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-blue">
              Add Vehicle
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                nextService={vehicle.nextService || {
                  type: 'Oil Change',
                  dueInMiles: Math.floor(Math.random() * 500) + 100, // Random value between 100 and 600
                  dueInDays: Math.floor(Math.random() * 30) + 5, // Random value between 5 and 35
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
