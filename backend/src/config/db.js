const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/karuna_db');
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    // Database na hone par bhi server chalane ke liye exit nahi karte dev mode me
  }
};

module.exports = connectDB;