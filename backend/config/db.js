const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/purecoco';

  if (!process.env.MONGODB_URI) {
    console.warn('Warning: MONGODB_URI is not set. Falling back to local MongoDB at mongodb://localhost:27017/purecoco');
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.log('Running without database — API will use fallback responses');
  }
};

module.exports = connectDB;
