const dns = require('dns');
// Set Google DNS at the very top to resolve Atlas SRV issue
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.log('DNS fallback active');
}

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

// Load environment variables explicitly from root .env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true
  }
});

// Attach socket instance to Express app
app.set('io', io);

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database Connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is undefined in .env file');
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`⚠️ MongoDB Connection Error: ${error.message}`);
  }
};
connectDB();

// API Routes
const ticketRoutes = require('./src/routes/ticketRoutes');
const feedRoutes = require('./src/routes/feedRoutes');

app.use('/api/tickets', ticketRoutes);
app.use('/api/feed', feedRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'KARUNA Disaster Management API'
  });
});

// Socket.io Live Mesh Connections
io.on('connection', (socket) => {
  console.log(`📡 Mesh Node Connected: ${socket.id}`);

  // Rescuer Live GPS stream relay
  socket.on('UPDATE_RESCUER_GPS', (data) => {
    socket.broadcast.emit('RESCUER_GPS_STREAM', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Mesh Node Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`⚡ Server running on http://localhost:${PORT}`);
});