/**
 * Database models for the Automotive Service Reminder Agent
 */

import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import config, { DB_CONFIG } from '../config';
import { Vehicle as VehicleType, MileageLog as MileageLogType, ServiceSchedule as ServiceScheduleType, Customer as CustomerType } from '../../../shared/types/models';

// Initialize Sequelize with the database configuration
const sequelize = new Sequelize({
  dialect: DB_CONFIG.type === 'sqlite' ? 'sqlite' : 'mysql',
  storage: DB_CONFIG.options.storage,
  host: DB_CONFIG.options.host,
  port: DB_CONFIG.options.port,
  username: DB_CONFIG.options.username,
  password: DB_CONFIG.options.password,
  database: DB_CONFIG.options.database,
  logging: DB_CONFIG.options.logging
});

// Define models
interface Models {
  Vehicle: typeof Vehicle;
  MileageLog: typeof MileageLog;
  ServiceSchedule: typeof ServiceSchedule;
  Customer: typeof Customer;
}

// Define the Vehicle model
class Vehicle extends Model implements VehicleType {
  public id!: number;
  public vin!: string;
  public make!: string;
  public model!: string;
  public year!: number;
  public customerId!: number;
  public createdAt!: Date;

  // Static methods for associations
  public static associate(models: Models): void {
    (Vehicle as any).belongsTo(models.Customer, { foreignKey: 'customerId', as: 'customer' });
    (Vehicle as any).hasMany(models.MileageLog, { foreignKey: 'vehicleId', as: 'mileageLogs' });
  }
}

// Define the MileageLog model
class MileageLog extends Model implements MileageLogType {
  public id!: number;
  public vehicleId!: number;
  public loggedAt!: Date;
  public mileage!: number;

  // Static methods for associations
  public static associate(models: Models): void {
    (MileageLog as any).belongsTo(models.Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
  }
}

// Define the ServiceSchedule model
class ServiceSchedule extends Model implements ServiceScheduleType {
  public id!: number;
  public make!: string;
  public model!: string;
  public serviceType!: string;
  public description!: string;
  public intervalMiles!: number;
  public intervalMonths!: number;
}

// Define the Customer model
class Customer extends Model implements CustomerType {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public preferredReminderType!: 'email' | 'sms' | 'both';
  public timezone!: string;
  public createdAt!: Date;

  // Static methods for associations
  public static associate(models: Models): void {
    (Customer as any).hasMany(models.Vehicle, { foreignKey: 'customerId', as: 'vehicles' });
  }
}

// Initialize models
(Vehicle as any).init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    vin: {
      type: DataTypes.STRING(17),
      allowNull: false,
      unique: true,
      validate: {
        len: [17, 17]
      }
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1900,
        max: new Date().getFullYear() + 1 // Allow current year + 1 for new models
      }
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'vehicles',
    timestamps: true,
    updatedAt: false
  }
);

(MileageLog as any).init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    loggedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    mileage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    }
  },
  {
    sequelize,
    tableName: 'mileage_logs',
    timestamps: false
  }
);

(ServiceSchedule as any).init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    serviceType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    intervalMiles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    intervalMonths: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    }
  },
  {
    sequelize,
    tableName: 'service_schedules',
    timestamps: false
  }
);

(Customer as any).init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preferredReminderType: {
      type: DataTypes.ENUM('email', 'sms', 'both'),
      allowNull: false,
      defaultValue: 'email'
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'America/New_York'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'customers',
    timestamps: true,
    updatedAt: false
  }
);

// Set up associations
const models = {
  Vehicle,
  MileageLog,
  ServiceSchedule,
  Customer
};

Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

// Export models and sequelize instance
export {
  sequelize,
  Vehicle,
  MileageLog,
  ServiceSchedule,
  Customer
};

// Function to sync all models with the database
export const syncDatabase = async (force: boolean = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};
