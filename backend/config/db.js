import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[MongoDB] MONGODB_URI is not defined in environment variables. Running in local JSON storage mode.');
    return false;
  }

  try {
    mongoose.set('strictQuery', false);
    
    // Connection options for MongoDB Atlas
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });

    isConnected = true;
    console.log(`[MongoDB] Successfully connected to Database: "${conn.connection.name}" at host: ${conn.connection.host}`);
    return true;
  } catch (err) {
    isConnected = false;
    console.error('[MongoDB] Connection error:', err.message);
    console.warn('[MongoDB] Application will utilize resilient hybrid storage (local fallback active).');
    return false;
  }
}

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[MongoDB] Connection lost. Fallback storage enabled.');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('[MongoDB] Connection re-established.');
});

export function isDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

export default connectDB;
