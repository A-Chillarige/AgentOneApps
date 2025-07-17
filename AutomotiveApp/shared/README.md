# Shared - Automotive Service Reminder Agent

This directory contains shared code, types, constants, and utilities that are used by both the frontend and backend of the Automotive Service Reminder Agent application.

## Purpose

The shared directory helps maintain consistency between the frontend and backend by:

- Providing common TypeScript interfaces and types
- Sharing constants and configuration values
- Offering utility functions that can be used in both environments

## Project Structure

```
shared/
├── types/              # TypeScript interfaces and type definitions
│   ├── models.ts       # Data model interfaces
│   ├── api.ts          # API request/response interfaces
│   └── common.ts       # Other shared types
├── constants/          # Shared constant values
│   ├── serviceTypes.ts # Service type definitions
│   ├── reminderTypes.ts # Reminder type definitions
│   └── config.ts       # Shared configuration values
├── utils/              # Shared utility functions
│   ├── dateUtils.ts    # Date manipulation utilities
│   ├── validators.ts   # Validation functions
│   └── formatters.ts   # Formatting utilities
└── README.md           # This file
```

## Key Shared Types

### Vehicle
```typescript
interface Vehicle {
  id: number;
  vin: string;
  make: string;
  model: string;
  year: number;
  customerId: number;
  createdAt: Date;
}
```

### MileageLog
```typescript
interface MileageLog {
  id: number;
  vehicleId: number;
  loggedAt: Date;
  mileage: number;
}
```

### ServiceSchedule
```typescript
interface ServiceSchedule {
  id: number;
  make: string;
  model: string;
  serviceType: string;
  description: string;
  intervalMiles: number;
  intervalMonths: number;
}
```

### Customer
```typescript
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  preferredReminderType: 'email' | 'sms' | 'both';
  timezone: string;
  createdAt: Date;
}
```

### Reminder
```typescript
interface Reminder {
  customer: string;
  vehicle: string;
  upcomingServices: Array<{
    type: string;
    dueInMiles: number;
    dueInDays: number;
  }>;
  actions: {
    emailSent: boolean;
    smsSent: boolean;
    calendarInviteAttached: boolean;
  };
}
```

## Usage

Both the frontend and backend reference these shared files to ensure consistency in data structures and business logic. When making changes to shared files, be aware that both parts of the application will be affected.

### In Backend

```typescript
import { Vehicle } from '../../shared/types/models';
```

### In Frontend

```typescript
import { Vehicle } from '../../../shared/types/models';
```

## Benefits

- Single source of truth for data structures
- Reduced duplication of code
- Type safety across the entire application
- Easier maintenance and updates
