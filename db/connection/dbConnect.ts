import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Use global to cache the connection across hot reloads in development
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

function logConnectionDetails(conn: typeof mongoose) {
  if (!conn?.connection) return;

  console.log(`

🧠 MongoDB Connection Established
----------------------------------------

✅ State     : ${conn.connection.readyState === 1 ? 'Connected' : 'Not connected'}
🌐 Host      : ${conn.connection.host}
🔌 Port      : ${conn.connection.port}
🗄️  Database : ${conn.connection.name}

📦 Models    : ${Object.keys(conn.models).join(', ') || 'None'}
----------------------------------------

`);
}

export default async function dbConnect() {
  if (cached.conn) {
    if (process.env.NODE_ENV === 'development') {
      logConnectionDetails(cached.conn);
    }
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;

  if (process.env.NODE_ENV === 'development') {
    logConnectionDetails(cached.conn);
  }

  return cached.conn;
}
