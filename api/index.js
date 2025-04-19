const express = require('express');
const router = express.Router();
const weatherMoodAdapter = require('./weatherMoodAdapter');
const emotionalJourneyMapper = require('./emotionalJourneyMapper');

// Mount the feature routers
router.use('/weather-mood', weatherMoodAdapter);
router.use('/emotional-journey', emotionalJourneyMapper);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', features: ['weather-mood-adapter', 'emotional-journey-mapper'] });
});

module.exports = router;