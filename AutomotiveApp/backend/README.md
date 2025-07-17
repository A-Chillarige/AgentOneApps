# Backend - Automotive Service Reminder Agent

This directory contains the Node.js + Express API with TypeScript and Sequelize ORM for the Automotive Service Reminder Agent application.

## Technology Stack

- Node.js
- Express
- TypeScript
- Sequelize ORM
- SQLite (configurable to switch to MySQL)
- Nodemailer/SendGrid for email notifications
- Twilio for SMS notifications

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── middleware/     # Express middleware
│   ├── types/          # TypeScript type definitions
│   ├── app.ts          # Express app setup
│   └── server.ts       # Server entry point
├── dist/               # Compiled JavaScript files
├── node_modules/       # Dependencies
├── .env                # Environment variables
├── .env.example        # Example environment variables
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## Models

- **Vehicle**: id, vin, make, model, year, customerId, createdAt
- **MileageLog**: id, vehicleId, loggedAt, mileage
- **ServiceSchedule**: id, make, model, serviceType, description, intervalMiles, intervalMonths
- **Customer**: id, name, email, phone, preferredReminderType, timezone, createdAt

## API Endpoints

- **GET /api/vehicles** - List all vehicles or filter by customer
- **POST /api/mileage** - Log or update vehicle mileage
- **GET /api/reminders** - Generate and preview upcoming service reminders
- **POST /api/notify** - Manually trigger email/SMS reminders
- **POST /api/settings/reset** - Wipe and reload seed data

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example` with your configuration.

3. Build the TypeScript code:
   ```
   npm run build
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Run the production server:
   ```
   npm start
   ```

## Database Configuration

The application uses SQLite by default but can be configured to use MySQL by setting the appropriate environment variables in the `.env` file.

## Reminder Agent Service

The application includes a background service that runs daily to check for upcoming service needs and send reminders to customers. This service can be configured to run as a cron job or as a timed script.
