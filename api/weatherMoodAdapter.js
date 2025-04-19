// src/api/weatherMoodAdapter.js
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Initialize OpenAI client (using environment variables)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Weather-Mood Adapter API
 * This service uses OpenAI to analyze weather conditions and provide 
 * mood optimization recommendations for events
 */

// Generate weather-mood adapter recommendations
router.post('/analyze', async (req, res) => {
  try {
    const { 
      location,  // Location of the event
      date,      // Date of the event
      eventType, // Type of event (conference, party, etc.)
      indoorEvent, // Whether it's an indoor event
      currentWeather = null // Optional current weather data if available
    } = req.body;

    if (!location || !date || !eventType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters' 
      });
    }

    // Fetch weather data if not provided
    // In a real implementation, you would use a weather API here
    const weatherData = currentWeather || await mockWeatherForecast(location, date);

    // Generate mood analysis and recommendations using AI
    const recommendations = await generateMoodRecommendations(weatherData, eventType, indoorEvent);

    return res.status(200).json({
      success: true,
      weatherData,
      recommendations
    });
  } catch (error) {
    console.error('Weather-Mood analysis error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to analyze weather-mood relationship',
      error: error.message
    });
  }
});

// Generate recommendations using OpenAI
async function generateMoodRecommendations(weatherData, eventType, indoorEvent) {
  const prompt = `
    As an AI event planning assistant, analyze the following weather conditions and provide recommendations 
    to optimize the mood and experience of attendees at this ${eventType}:

    Weather Details:
    - Temperature: ${weatherData.temperature}°${weatherData.temperatureUnit}
    - Condition: ${weatherData.condition}
    - Humidity: ${weatherData.humidity}%
    - Wind: ${weatherData.windSpeed} mph
    - Time of Day: ${weatherData.timeOfDay}
    - Is Indoor Event: ${indoorEvent ? 'Yes' : 'No'}

    Based on psychological research linking weather to mood, provide the following:
    1. Expected mood impact of these weather conditions on attendees
    2. 3-4 specific recommendations for adjusting:
       - Lighting (colors, intensity, effects)
       - Music (genres, tempo, volume)
       - Activities or schedule adjustments
       - Food and beverage recommendations
    3. Any contingency plans needed
    
    Format the response as a structured JSON object with the following fields:
    - moodImpact: a description of the expected mood
    - lighting: lighting recommendations
    - music: music recommendations
    - activities: activity recommendations
    - foodBeverage: food and beverage recommendations
    - contingencyPlans: any necessary contingency plans
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are an AI event planning assistant with expertise in environmental psychology and weather-mood relationships." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  });

  try {
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error parsing OpenAI response:", error);
    return {
      moodImpact: "Unable to determine mood impact",
      lighting: "Standard lighting recommended",
      music: "Choose music based on event theme",
      activities: "Proceed with planned activities",
      foodBeverage: "Standard refreshments",
      contingencyPlans: "No specific contingencies needed"
    };
  }
}

// Mock weather forecast function (would be replaced with real weather API in production)
async function mockWeatherForecast(location, date) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real implementation, this would call a weather API
  // For now, generate somewhat realistic weather data
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Stormy', 'Snowy', 'Foggy', 'Clear'];
  const timeOptions = ['Morning', 'Afternoon', 'Evening', 'Night'];
  
  return {
    location,
    date,
    temperature: Math.floor(Math.random() * 35) + 40, // 40-75°F
    temperatureUnit: 'F',
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
    windSpeed: Math.floor(Math.random() * 15) + 1, // 1-15 mph
    timeOfDay: timeOptions[Math.floor(Math.random() * timeOptions.length)]
  };
}

module.exports = router;