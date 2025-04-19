// api/health.js
export default function handler(req, res) {
    res.status(200).json({ 
      status: 'ok', 
      features: ['weather-mood-adapter', 'emotional-journey-mapper'] 
    });
  }