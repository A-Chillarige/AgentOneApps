import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="text-navy-blue mb-6">
        <svg
          className="w-24 h-24 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      
      <h1 className="text-4xl font-bold text-navy-blue mb-4">404 - Page Not Found</h1>
      
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link
        to="/"
        className="px-6 py-3 bg-navy-blue text-white rounded-md hover:bg-navy-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-blue"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
