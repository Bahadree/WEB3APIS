const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { connectDB, connectRedis } = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const gameRoutes = require('./routes/games');
const nftRoutes = require('./routes/nfts');
const devRoutes = require('./routes/dev');
const projectImageRoutes = require('./routes/projectImage');
const oauthRoutes = require('./routes/oauth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://web3apis.up.railway.app'
];
app.use(cors({
  origin: (origin, callback) => {
    // origin undefined ise (ör: Postman, curl) veya izin verilenler arasında ise izin ver
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('CORS engellendi:', origin);
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Preflight (OPTIONS) istekleri için genel yanıt
app.options('*', cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes için debug logları
console.log('Route register: /api/auth', typeof authRoutes);
app.use('/api/auth', authRoutes);
console.log('Route register: /api/users', typeof userRoutes);
app.use('/api/users', userRoutes);
console.log('Route register: /api/games', typeof gameRoutes);
app.use('/api/games', gameRoutes);
console.log('Route register: /api/nfts', typeof nftRoutes);
app.use('/api/nfts', nftRoutes);
console.log('Route register: /api/dev', typeof devRoutes);
app.use('/api/dev', devRoutes);
console.log('Route register: /api/dev/projects', typeof projectImageRoutes);
app.use('/api/dev/projects', projectImageRoutes);
console.log('Route register: /api/oauth', typeof oauthRoutes);
app.use('/api/oauth', oauthRoutes);
console.log('Route register: /uploads', 'static');
app.use('/uploads', express.static(require('path').join(__dirname, '../uploads')));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

// Initialize database connections and start server
const startServer = async () => {
  try {
    // Connect to PostgreSQL
    await connectDB();
    
    // Try to connect to Redis (optional)
    await connectRedis();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Gracefully shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🔄 Gracefully shutting down server...');
  process.exit(0);
});

startServer();

module.exports = app;
