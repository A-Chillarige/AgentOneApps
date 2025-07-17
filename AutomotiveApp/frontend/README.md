# Frontend - Automotive Service Reminder Agent

This directory contains the React frontend application with Tailwind CSS for the Automotive Service Reminder Agent.

## Technology Stack

- React
- TypeScript
- Tailwind CSS
- React Router for navigation
- Axios for API requests
- React Query for data fetching and caching

## Project Structure

```
frontend/
├── public/             # Static files
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   │   ├── common/     # Generic components
│   │   ├── layout/     # Layout components
│   │   ├── vehicles/   # Vehicle-related components
│   │   └── reminders/  # Reminder-related components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service functions
│   ├── utils/          # Utility functions
│   ├── context/        # React context providers
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main App component
│   └── index.tsx       # Entry point
├── node_modules/       # Dependencies
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── README.md           # This file
```

## Pages

- **Dashboard** - Overview of customer vehicles and upcoming service reminders
- **Vehicle Detail Page** - Show VIN, mileage history, and log new mileage
- **Reminder Agent** - Display scheduled or pending service reminders
- **Settings Panel** - Manage data reset and notification preferences

## Key Components

- **VehicleCard** - Shows summary and next due service
- **MileageForm** - Logs new mileage and updates reminder logic
- **ReminderList** - Lists all upcoming reminders for a user or vehicle
- **SettingsPanel** - Toggle reminder options and reset database

## Color Palette

- Navy Blue: #0f4c81
- Off-White: #f5f5f5
- Gold: #fdbc3d
- Forest Green: #2e8b57

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Build for production:
   ```
   npm run build
   ```

## API Integration

The frontend communicates with the backend API to:
- Fetch vehicle and customer data
- Submit mileage logs
- Generate and view service reminders
- Manage notification settings

## Responsive Design

The application is designed to be responsive and work well on both desktop and mobile devices.
