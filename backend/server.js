const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDB } = require('./config/db');
const { PlayerModel } = require('./models/Player');
const playerRoutes = require('./routes/playerRoutes');
const cardRoutes = require('./routes/cardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Database & Seed Defaults
initDB();
PlayerModel.seedDefaultsIfEmpty();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve frontend static assets
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api', playerRoutes);
app.use('/api', cardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Dynamo FC Player Card System'
  });
});

// Single Page fallback for frontend
app.get('*', (req, res) => {
  // If request is not for /api, serve index.html
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  } else {
    res.status(404).json({ error: 'Endpoint not found' });
  }
});

// Start server locally (on Vercel serverless functions, the app is exported)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`⚡ DYNAMO FC PLAYER CARD SYSTEM (V1)`);
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
    console.log(`📋 API Health:        http://localhost:${PORT}/api/health`);
    console.log(`👥 Squad API:         http://localhost:${PORT}/api/players`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
