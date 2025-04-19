// src/api/emotionalJourneyMapper.js
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Emotional Journey Mapper API
 * This service uses OpenAI to design and map emotional touchpoints
 * throughout an event to create memorable experiences
 */

// Generate emotional journey map for an event
router.post('/generate', async (req, res) => {
  try {
    const { 
      eventType,       // Type of event (conference, wedding, etc.)
      eventDuration,   // Duration in hours
      audienceSize,    // Number of attendees
      audienceDetails, // Demographics, interests, etc.
      eventGoals,      // Main goals of the event
      keyMoments = [], // Important moments already planned
      desiredEmotions = [] // Target emotions if any
    } = req.body;

    if (!eventType || !eventDuration || !audienceSize || !eventGoals) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters' 
      });
    }

    // Generate emotional journey map using AI
    const journeyMap = await generateEmotionalJourney(
      eventType, 
      eventDuration, 
      audienceSize, 
      audienceDetails, 
      eventGoals, 
      keyMoments,
      desiredEmotions
    );

    return res.status(200).json({
      success: true,
      journeyMap
    });
  } catch (error) {
    console.error('Emotional journey mapping error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate emotional journey map',
      error: error.message
    });
  }
});

// Generate emotional journey using OpenAI
async function generateEmotionalJourney(
  eventType, 
  eventDuration, 
  audienceSize, 
  audienceDetails, 
  eventGoals, 
  keyMoments,
  desiredEmotions
) {
  // Create time segments based on event duration
  const numberOfSegments = Math.max(5, Math.min(10, Math.ceil(eventDuration / 0.5)));
  
  // Build the prompt for OpenAI
  const prompt = `
    As an AI emotional journey designer for events, create a detailed emotional journey map for the following event:

    Event Details:
    - Type: ${eventType}
    - Duration: ${eventDuration} hours
    - Audience Size: ${audienceSize} people
    - Audience Details: ${audienceDetails || 'General audience'}
    - Event Goals: ${eventGoals}
    - Key Planned Moments: ${keyMoments.length > 0 ? keyMoments.join(', ') : 'None specified'}
    - Desired Emotions: ${desiredEmotions.length > 0 ? desiredEmotions.join(', ') : 'Not specified'}

    Create an emotional journey map with ${numberOfSegments} segments that guides attendees through a meaningful emotional experience.
    For each segment of the event, provide:
    
    1. The primary emotion to evoke
    2. Specific sensory elements to create this emotion (visual, auditory, etc.)
    3. Activity recommendations to induce this emotion
    4. Transitions between emotional states
    
    Structure your response as a JSON array where each object represents a segment of the emotional journey with the following fields:
    - timepoint: description of when this occurs (e.g., "Arrival", "30 minutes in", "Conclusion")
    - emotion: the primary emotion to evoke
    - description: brief description of this emotional phase
    - elements: specific elements to implement (lighting, music, activities, etc.)
    - transitions: how to transition to the next emotional state
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are an AI specializing in emotional design for events, with expertise in environmental psychology and experience design." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  });

  try {
    const parsedResponse = JSON.parse(completion.choices[0].message.content);
    
    // Add metadata to the response
    return {
      metadata: {
        eventType,
        duration: eventDuration,
        audienceSize,
        generatedAt: new Date().toISOString(),
      },
      journey: parsedResponse.journey || parsedResponse
    };
  } catch (error) {
    console.error("Error parsing OpenAI response:", error);
    // Return a fallback journey map
    return {
      metadata: {
        eventType,
        duration: eventDuration,
        audienceSize,
        generatedAt: new Date().toISOString(),
        error: "Failed to generate custom journey"
      },
      journey: generateFallbackJourney(eventType, numberOfSegments)
    };
  }
}

// Generate a basic fallback journey if the API fails
function generateFallbackJourney(eventType, segments) {
  const basicJourney = [
    {
      timepoint: "Arrival",
      emotion: "Anticipation",
      description: "Building excitement as guests arrive",
      elements: "Upbeat welcome music, warm lighting, greeting area",
      transitions: "Gradual increase in social interaction"
    },
    {
      timepoint: "Main Event Beginning",
      emotion: "Engagement",
      description: "Focusing audience attention on event content",
      elements: "Dimming peripheral lights, spotlight on main area, attention-grabbing opening",
      transitions: "Transitional announcement or audio cue"
    },
    {
      timepoint: "Core Experience",
      emotion: "Immersion",
      description: "Deep engagement with event content/purpose",
      elements: "Full sensory engagement, matched to event purpose",
      transitions: "Maintain engagement through varied stimuli"
    },
    {
      timepoint: "Peak Moment",
      emotion: "Elevation",
      description: "Creating a memorable high point",
      elements: "Crescendo in music, lighting change, collective activity",
      transitions: "Allow moment to breathe before transitioning"
    },
    {
      timepoint: "Conclusion",
      emotion: "Reflection & Connection",
      description: "Meaningful closure and lasting impression",
      elements: "Summarizing elements, group acknowledgment, forward-looking statements",
      transitions: "Clear conclusion signaling"
    }
  ];
  
  // Return either the basic journey or a subset based on requested segments
  return basicJourney.slice(0, Math.min(basicJourney.length, segments));
}

module.exports = router;