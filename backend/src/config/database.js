const { Pool } = require('pg');
const redis = require('redis');

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Redis connection
let redisClient;

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    client.release();
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    throw error;
  }
};

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500)
      }
    });

    redisClient.on('error', (err) => {
      console.warn('⚠️ Redis Client Error:', err.message);
      // Don't throw error, just log warning
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    await redisClient.connect();
  } catch (error) {
    console.warn('⚠️ Redis connection failed:', error.message);
    console.log('📝 Continuing without Redis (caching disabled)');
    redisClient = null; // Set to null so we know Redis is not available
  }
};

// Database query helper
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query:', { text, duration, rows: res.rowCount });
    }
    
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Redis helpers
const setCache = async (key, value, expiration = 3600) => {
  try {
    if (redisClient && redisClient.isOpen) {
      await redisClient.setEx(key, expiration, JSON.stringify(value));
    }
  } catch (error) {
    console.error('Redis set error:', error);
  }
};

const getCache = async (key) => {
  try {
    if (redisClient && redisClient.isOpen) {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    }
    return null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

const deleteCache = async (key) => {
  try {
    if (redisClient && redisClient.isOpen) {
      await redisClient.del(key);
    }
  } catch (error) {
    console.error('Redis delete error:', error);
  }
};

module.exports = {
  pool,
  query,
  connectDB,
  connectRedis,
  redisClient,
  setCache,
  getCache,
  deleteCache,
};
