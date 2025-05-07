import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env",
  );
}

const MONGODB_URI = process.env.MONGODB_URI;

let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // max number of connections in the pool
      minPoolSize: 2, // keep some idle connections ready
      maxIdleTimeMS: 1000 * 60, // close idle connections after 1 minute
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      keepAlive: true,
      keepAliveInitialDelay: 300000, // 5 minutes
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
