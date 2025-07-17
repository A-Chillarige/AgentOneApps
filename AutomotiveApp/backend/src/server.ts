/**
 * Server entry point for the Automotive Service Reminder Agent
 */

import app from './app';
import { SERVER_CONFIG } from './config';
import { sequelize, syncDatabase } from './models';
import cron from 'node-cron';
import { setupReminderAgent } from './services/reminderAgent';

// Start the server
const startServer = async (): Promise<void> => {
  try {
    // Connect to the database and sync models
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    await syncDatabase(false); // false = don't force sync (don't drop tables)
    console.log('Database models synced successfully');
    
    // Start the Express server
    app.listen(SERVER_CONFIG.port, () => {
      console.log(`Server running in ${SERVER_CONFIG.nodeEnv} mode on port ${SERVER_CONFIG.port}`);
    });
    
    // Set up the reminder agent to run daily
    setupReminderAgent();
    
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Start the server
startServer();
