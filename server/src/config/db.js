import mongoose from 'mongoose';

/** Connects to MongoDB Atlas / Local MongoDB instance */
const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false); // CRITICAL: fail fast, don't hang
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio', {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB unavailable, continuing without database: ${error.message}`);
  }
};

export default connectDB;
