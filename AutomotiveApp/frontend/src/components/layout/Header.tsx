import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-navy-blue text-off-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-off-white hover:text-white hover:bg-navy-blue-dark focus:outline-none"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <svg 
              className="h-8 w-8 mr-2" 
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
            <span className="text-xl font-bold">Automotive Service Reminder</span>
          </Link>
        </div>
        
        {/* Right side navigation */}
        <div className="flex items-center">
          <Link 
            to="/settings" 
            className="text-off-white hover:text-white p-2 rounded-md"
            title="Settings"
          >
            <svg 
              className="h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
