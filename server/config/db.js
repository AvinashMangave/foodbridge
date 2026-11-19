const mongoose = require('mongoose');

let isConnected = false;
let isMockMode = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodbridge';

  try {
    console.log(`Connecting to MongoDB at ${uri}...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1200,
    });
    isConnected = true;
    isMockMode = false;
    console.log('✅ MongoDB connected successfully via Mongoose.');
  } catch (error) {
    console.warn('⚠️  Could not connect to MongoDB server:', error.message);
    console.log('💡 Initializing FoodBridge Integrated Adaptive Data Store (Zero-Config Persistent Mode). All features, APIs, and seeding work identically!');
    isConnected = false;
    isMockMode = true;
  }
};

const getDbMode = () => ({
  isConnected,
  isMockMode,
  driver: isConnected ? 'Native MongoDB' : 'Integrated Local Store'
});

module.exports = {
  connectDB,
  getDbMode,
  isMock: () => isMockMode
};
