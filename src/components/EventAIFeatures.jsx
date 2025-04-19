// src/components/EventAIFeatures.jsx
// This shows how to properly call the APIs from your frontend components

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import WeatherMoodAdapter from './WeatherMoodAdapter';
import EmotionalJourneyMapper from './EmotionalJourneyMapper';
import { Cloud, Smile, RefreshCw, AlertCircle } from 'lucide-react';

/**
 * EventAIFeatures component for displaying AI analysis results
 * Used in the event details page after event creation
 */
const EventAIFeatures = ({ event }) => {
  const [activeTab, setActiveTab] = useState('weather');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [journeyData, setJourneyData] = useState(null);

  // Fetch AI analysis data when component mounts
  useEffect(() => {
    if (event) {
      if (event.weatherAdapter) {
        fetchWeatherAnalysis();
      }
      
      if (event.emotionalJourney) {
        fetchEmotionalJourney();
      }
    }
  }, [event]);

  // Calculate event duration from start and end times
  const calculateEventDuration = () => {
    if (!event?.startTime || !event?.endTime) return 2; // Default 2 hours
    
    const startParts = event.startTime.split(':');
    const endParts = event.endTime.split(':');
    
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

  // src/components/EventAIFeatures.jsx - Updated API Calls
// Update these functions in your EventAIFeatures component

// Fetch weather-mood analysis
const fetchWeatherAnalysis = async () => {
    try {
      setLoading(true);
      
      // Make sure we have the required data
      if (!event.location || !event.startDate || !event.category) {
        throw new Error('Missing required event data for weather analysis');
      }
      
      const response = await fetch('/api/weather-mood/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: event.location,
          date: event.startDate,
          eventType: event.category,
          indoorEvent: !event.virtualEvent
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch weather-mood analysis');
      }
      
      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      console.error('Weather-mood analysis error:', err);
      setError(`Weather analysis failed: ${err.message}`);
      setLoading(false);
    }
  };
  
  // Fetch emotional journey map
  const fetchEmotionalJourney = async () => {
    try {
      setLoading(true);
      
      // Calculate event duration 
      const duration = calculateEventDuration();
      
      // Make sure we have the required data
      if (!event.category || !event.capacity || !event.description) {
        throw new Error('Missing required event data: need category, capacity, and description');
      }
      
      const response = await fetch('/api/emotional-journey/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: event.category,
          eventDuration: duration,
          audienceSize: event.capacity,
          audienceDetails: event.notes || `Audience of ${event.capacity} attendees`,
          eventGoals: event.description,
          keyMoments: [],
          desiredEmotions: []
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch emotional journey map');
      }
      
      setJourneyData(data);
      setLoading(false);
    } catch (err) {
      console.error('Emotional journey mapping error:', err);
      setError(`Emotional journey mapping failed: ${err.message}`);
      setLoading(false);
    }
  };

  // Helper to determine which tabs are available
  const getAvailableTabs = () => {
    if (event.weatherAdapter && event.emotionalJourney) {
      return ['weather', 'journey'];
    } else if (event.weatherAdapter) {
      return ['weather'];
    } else if (event.emotionalJourney) {
      return ['journey'];
    }
    return [];
  };

  // If no AI features are enabled
  if (!event?.weatherAdapter && !event?.emotionalJourney) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-white">AI-Powered Event Analysis</h2>
        <p className="text-indigo-100 text-sm mt-1">
          AI-generated insights and recommendations for your event
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-800 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p>{error}</p>
          <button 
            onClick={() => {
              setError('');
              if (activeTab === 'weather') {
                fetchWeatherAnalysis();
              } else {
                fetchEmotionalJourney();
              }
            }}
            className="ml-auto text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md flex items-center"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </button>
        </div>
      )}

      <div className="p-6">
        {getAvailableTabs().length > 1 ? (
          <Tabs 
            defaultValue={getAvailableTabs()[0]} 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-6">
              {event.weatherAdapter && (
                <TabsTrigger 
                  value="weather" 
                  className="flex items-center justify-center py-3"
                >
                  <Cloud className="h-5 w-5 mr-2" />
                  Weather-Mood Analysis
                </TabsTrigger>
              )}
              
              {event.emotionalJourney && (
                <TabsTrigger 
                  value="journey" 
                  className="flex items-center justify-center py-3"
                >
                  <Smile className="h-5 w-5 mr-2" />
                  Emotional Journey Map
                </TabsTrigger>
              )}
            </TabsList>
            
            {event.weatherAdapter && (
              <TabsContent value="weather" className="focus:outline-none mt-0">
                {loading && activeTab === 'weather' ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading weather analysis...</p>
                  </div>
                ) : weatherData ? (
                  <WeatherMoodAdapter 
                    eventData={event} 
                    initialData={weatherData}
                    viewMode={true}
                  />
                ) : (
                  <div className="text-center py-8">
                    <button
                      onClick={fetchWeatherAnalysis}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Generate Weather-Mood Analysis
                    </button>
                  </div>
                )}
              </TabsContent>
            )}
            
            {event.emotionalJourney && (
              <TabsContent value="journey" className="focus:outline-none mt-0">
                {loading && activeTab === 'journey' ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
                    <p className="mt-4 text-gray-600">Mapping emotional journey...</p>
                  </div>
                ) : journeyData ? (
                  <EmotionalJourneyMapper 
                    eventData={event}
                    initialData={journeyData}
                    viewMode={true}
                  />
                ) : (
                  <div className="text-center py-8">
                    <button
                      onClick={fetchEmotionalJourney}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Generate Emotional Journey Map
                    </button>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        ) : (
          // Single feature view (no tabs)
          <div>
            {event.weatherAdapter && (
              <div>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">Loading weather analysis...</p>
                  </div>
                ) : weatherData ? (
                  <WeatherMoodAdapter 
                    eventData={event} 
                    initialData={weatherData}
                    viewMode={true}
                  />
                ) : (
                  <div className="text-center py-8">
                    <button
                      onClick={fetchWeatherAnalysis}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Generate Weather-Mood Analysis
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {event.emotionalJourney && (
              <div>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
                    <p className="mt-4 text-gray-600">Mapping emotional journey...</p>
                  </div>
                ) : journeyData ? (
                  <EmotionalJourneyMapper 
                    eventData={event}
                    initialData={journeyData}
                    viewMode={true}
                  />
                ) : (
                  <div className="text-center py-8">
                    <button
                      onClick={fetchEmotionalJourney}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Generate Emotional Journey Map
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventAIFeatures;