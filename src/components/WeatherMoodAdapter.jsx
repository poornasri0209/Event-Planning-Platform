// src/components/WeatherMoodAdapter.jsx
import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, ThermometerSun, Calendar, MapPin, AlertCircle, Check } from 'lucide-react';

const WeatherMoodAdapter = ({ eventData, onSave, initialData, viewMode = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    // If initialData is provided, use it (for view mode)
    if (initialData) {
      setWeatherData(initialData.weatherData);
      setRecommendations(initialData.recommendations);
    }
    // Otherwise, only fetch if we have the necessary event data and not in view mode
    else if (eventData?.location && eventData?.startDate && eventData?.category && !viewMode) {
      fetchWeatherMoodAnalysis();
    }
  }, [eventData, initialData, viewMode]);

  // Fetch weather-mood analysis from the backend
  const fetchWeatherMoodAnalysis = async () => {
    try {
      setLoading(true);
      setError('');

      // Make sure we have the required fields
      if (!eventData.location || !eventData.startDate || !eventData.category) {
        throw new Error('Missing required data: location, date, or event type');
      }

      const response = await fetch('/api/weather-mood/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: eventData.location,
          date: eventData.startDate,
          eventType: eventData.category,
          indoorEvent: !eventData.virtualEvent // Assuming non-virtual events are indoor
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch weather-mood analysis');
      }

      setWeatherData(data.weatherData);
      setRecommendations(data.recommendations);
    } catch (err) {
      console.error('Weather-mood analysis error:', err);
      setError(`Unable to analyze weather-mood relationship: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Render appropriate weather icon based on condition
  const renderWeatherIcon = (condition) => {
    if (!condition) return <Cloud />;
    
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('rain')) return <CloudRain />;
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) return <Sun />;
    if (lowerCondition.includes('cloud')) return <Cloud />;
    return <Cloud />;
  };

  // Apply recommendations to event
  const handleApplyRecommendations = () => {
    if (onSave && recommendations) {
      onSave(recommendations);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString; // Fallback to the original string if parsing fails
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {!viewMode && (
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Cloud className="mr-2 h-6 w-6" />
            Weather-Mood Adapter
          </h2>
        </div>
      )}

      {error && (
        <div className="px-6 py-4 bg-red-50 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Analyzing weather patterns and mood impact...</p>
          </div>
        ) : !weatherData ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-3">
              {eventData?.location && eventData?.startDate && eventData?.category
                ? "Get personalized recommendations based on weather conditions for your event."
                : "Please provide event location, date, and category to analyze weather impact."}
            </p>
            {(eventData?.location && eventData?.startDate && eventData?.category) && (
              <button 
                onClick={fetchWeatherMoodAnalysis}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Analyze Weather-Mood
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Weather Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Weather Forecast</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-sm">
                    {renderWeatherIcon(weatherData.condition)}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="font-medium">{weatherData.condition}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-sm">
                    <ThermometerSun className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Temperature</p>
                    <p className="font-medium">{weatherData.temperature}°{weatherData.temperatureUnit || 'F'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-sm">
                    <MapPin className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{weatherData.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-sm">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">
                      {formatDate(weatherData.date)}
                      {weatherData.timeOfDay ? ` (${weatherData.timeOfDay})` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mood Impact */}
            {recommendations && (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Expected Mood Impact</h3>
                  <p className="text-gray-700">{recommendations.moodImpact}</p>
                </div>
                
                {/* Recommendations */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Recommendations</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900">Lighting</h4>
                      <p className="text-gray-700">{recommendations.lighting}</p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900">Music</h4>
                      <p className="text-gray-700">{recommendations.music}</p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900">Activities</h4>
                      <p className="text-gray-700">{recommendations.activities}</p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900">Food & Beverage</h4>
                      <p className="text-gray-700">{recommendations.foodBeverage}</p>
                    </div>
                  </div>
                </div>
                
                {/* Contingency Plans */}
                {recommendations.contingencyPlans && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Contingency Plans</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-gray-700">{recommendations.contingencyPlans}</p>
                    </div>
                  </div>
                )}
                
                {/* Apply button - only show if not in view mode */}
                {!viewMode && onSave && (
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleApplyRecommendations}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Check className="h-5 w-5 mr-2" />
                      Apply Recommendations
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherMoodAdapter;