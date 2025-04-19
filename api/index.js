const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import your API routes
const weatherMoodAdapter = require('./weather-mood/analyze');
const emotionalJourneyMapper = require('./weather-mood/analyze');

// Mount the feature routers
app.use('/weather-mood', weatherMoodAdapter);
app.use('/emotional-journey', emotionalJourneyMapper);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', features: ['weather-mood-adapter', 'emotional-journey-mapper'] });
});

// Export for Vercel serverless function
module.exports = app;