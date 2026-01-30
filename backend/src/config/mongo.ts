import mongoose from 'mongoose';
import { env } from './env';

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  await mongoose.connect(env.mongoUri, {
    // options can be added here if needed
  });

  return mongoose.connection;
}

export function getMongoConnection() {
  return mongoose.connection;
}

