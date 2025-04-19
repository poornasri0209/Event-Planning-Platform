// src/components/EmotionalJourneyMapper.jsx
import React, { useState, useEffect } from 'react';
import { Smile, Clock, Users, AlertCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';

const EmotionalJourneyMapper = ({ eventData, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [journeyMap, setJourneyMap] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [desiredEmotions, setDesiredEmotions] = useState([]);
  const [emotionInput, setEmotionInput] = useState('');

  // Common emotions that could be suggested to the user
  const commonEmotions = [
    'Excitement', 'Wonder', 'Joy', 'Inspiration', 'Nostalgia', 
    'Connection', 'Anticipation', 'Satisfaction', 'Pride', 'Gratitude'
  ];

  useEffect(() => {
    // If we already have a journey map, don't fetch again automatically
    if (!journeyMap && hasRequiredEventData()) {
      generateJourneyMap();
    }
  }, [eventData]);

  // Check if we have the required event data to generate a journey map
  const hasRequiredEventData = () => {
    return eventData?.category && 
           eventData?.startDate && 
           eventData?.capacity && 
           (eventData?.startTime && eventData?.endTime);
  };

  // Calculate event duration from start and end times
  const calculateEventDuration = () => {
    if (!eventData?.startTime || !eventData?.endTime) return 2; // Default 2 hours
    
    const startParts = eventData.startTime.split(':');
    const endParts = eventData.endTime.split(':');
    
    if (startParts.length < 2 || endParts.length < 2) return 2;
    
    const startHour = parseInt(startParts[0]);
    const startMinute = parseInt(startParts[1]);
    const endHour = parseInt(endParts[0]);
    const endMinute = parseInt(endParts[1]);
    
    // Calculate total minutes
    let startTotalMinutes = startHour * 60 + startMinute;
    let endTotalMinutes = endHour * 60 + endMinute;
    
    // Handle case where event ends next day
    if (endTotalMinutes < startTotalMinutes) {
      endTotalMinutes += 24 * 60;
    }
    
    // Convert minutes to hours with one decimal precision
    return Math.round((endTotalMinutes - startTotalMinutes) / 6) / 10;
  };

  // Generate emotional journey map from the backend
  const generateJourneyMap = async () => {
    if (!hasRequiredEventData()) {
      setError('Please fill in event type, date, time, and capacity to generate a journey map.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');

      const duration = calculateEventDuration();
      
      // Prepare audience details string
      const audienceDetails = eventData.notes 
        ? eventData.notes 
        : `Audience of ${eventData.capacity} attendees`;

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/emotional-journey/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: eventData.category,
          eventDuration: duration,
          audienceSize: eventData.capacity,
          audienceDetails: audienceDetails,
          eventGoals: eventData.description || `Successful ${eventData.category} event`,
          desiredEmotions: desiredEmotions
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate emotional journey map');
      }

      setJourneyMap(data.journeyMap);
      
      // Initially expand the first section
      if (data.journeyMap?.journey && data.journeyMap.journey.length > 0) {
        setExpandedSections({ 0: true });
      }
      
    } catch (err) {
      console.error('Emotional journey mapping error:', err);
      setError('Unable to generate emotional journey map. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle expanded state for a journey section
  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Add a desired emotion
  const addEmotion = (emotion) => {
    const trimmedEmotion = (emotion || emotionInput).trim();
    if (trimmedEmotion && !desiredEmotions.includes(trimmedEmotion)) {
      setDesiredEmotions([...desiredEmotions, trimmedEmotion]);
      setEmotionInput('');
    }
  };

  // Remove a desired emotion
  const removeEmotion = (emotion) => {
    setDesiredEmotions(desiredEmotions.filter(e => e !== emotion));
  };

  // Apply journey map to event
  const handleApplyJourneyMap = () => {
    if (onSave && journeyMap) {
      onSave(journeyMap);
    }
  };

  // Render a color based on the emotion
  const getEmotionColor = (emotion) => {
    if (!emotion) return 'bg-gray-100';
    
    const emotionLower = emotion.toLowerCase();
    
    if (emotionLower.includes('joy') || emotionLower.includes('happy') || emotionLower.includes('excite')) {
      return 'bg-yellow-100 border-yellow-300';
    }
    if (emotionLower.includes('calm') || emotionLower.includes('peace') || emotionLower.includes('tranquil')) {
      return 'bg-blue-100 border-blue-300';
    }
    if (emotionLower.includes('inspire') || emotionLower.includes('awe') || emotionLower.includes('wonder')) {
      return 'bg-purple-100 border-purple-300';
    }
    if (emotionLower.includes('connect') || emotionLower.includes('belong') || emotionLower.includes('commun')) {
      return 'bg-green-100 border-green-300';
    }
    if (emotionLower.includes('nostalg') || emotionLower.includes('reflect') || emotionLower.includes('contemp')) {
      return 'bg-indigo-100 border-indigo-300';
    }
    if (emotionLower.includes('anticip') || emotionLower.includes('excite') || emotionLower.includes('surprise')) {
      return 'bg-orange-100 border-orange-300';
    }
    
    return 'bg-indigo-100 border-indigo-300'; // Default
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Smile className="mr-2 h-6 w-6" />
          Emotional Journey Mapper
        </h2>
      </div>

      {error && (
        <div className="px-6 py-4 bg-red-50 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <div className="p-6">
        {/* Desired Emotions Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Desired Emotions (Optional)
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Select emotions you want your attendees to experience during the event
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {desiredEmotions.map((emotion, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
              >
                {emotion}
                <button 
                  onClick={() => removeEmotion(emotion)}
                  className="ml-1.5 text-purple-600 hover:text-purple-800"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={emotionInput}
              onChange={(e) => setEmotionInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEmotion())}
              placeholder="Add emotion..."
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={() => addEmotion()}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Add
            </button>
          </div>
          
          {/* Suggested emotions */}
          {desiredEmotions.length < 5 && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-1">Suggested emotions:</p>
              <div className="flex flex-wrap gap-1.5">
                {commonEmotions
                  .filter(emotion => !desiredEmotions.includes(emotion))
                  .slice(0, 5)
                  .map((emotion, index) => (
                    <button
                      key={index}
                      onClick={() => addEmotion(emotion)}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                    >
                      {emotion}
                    </button>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
            <p className="mt-4 text-gray-600">Designing your emotional journey map...</p>
          </div>
        ) : !journeyMap ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              {hasRequiredEventData() 
                ? "Generate an emotional journey map to guide attendees through meaningful experiences."
                : "Complete your event details (type, time, date, capacity) to generate an emotional journey map."}
            </p>
            <button 
              onClick={generateJourneyMap}
              disabled={!hasRequiredEventData()}
              className={`px-4 py-2 rounded-md ${
                hasRequiredEventData() 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Generate Emotional Journey
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Journey Map Overview */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Emotional Journey Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-sm">
                    <Clock className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Event Duration</p>
                    <p className="font-medium">{journeyMap.metadata.duration} hours</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-sm">
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Audience Size</p>
                    <p className="font-medium">{journeyMap.metadata.audienceSize} attendees</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Journey Segments */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Emotional Journey Segments</h3>
              
              <div className="space-y-3">
                {journeyMap.journey.map((segment, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg overflow-hidden ${getEmotionColor(segment.emotion)}`}
                  >
                    {/* Segment Header */}
                    <div 
                      className="p-4 cursor-pointer flex justify-between items-center"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="bg-white p-1.5 rounded-full mr-3">
                            <Smile className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{segment.timepoint}</h4>
                            <p className="text-sm">{segment.emotion}</p>
                          </div>
                        </div>
                      </div>
                      {expandedSections[index] ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    
                    {/* Segment Details */}
                    {expandedSections[index] && (
                      <div className="p-4 border-t bg-white bg-opacity-70">
                        <p className="text-gray-700 mb-3">{segment.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">Implementation Elements</h5>
                            <p className="text-sm text-gray-700">{segment.elements}</p>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">Transition</h5>
                            <p className="text-sm text-gray-700">{segment.transitions}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Apply button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleApplyJourneyMap}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Check className="h-5 w-5 mr-2" />
                Apply Journey Map
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionalJourneyMapper;