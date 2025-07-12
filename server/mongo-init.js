// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

db = db.getSiblingDB('dashboard-app');

// Create application user
db.createUser({
  user: 'app_user',
  pwd: 'app_password_change_this',
  roles: [
    {
      role: 'readWrite',
      db: 'dashboard-app'
    }
  ]
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });

// Create sample admin user (optional)
db.users.insertOne({
  email: 'admin@example.com',
  isVerified: true,
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
});

print('Database initialization completed successfully!');
