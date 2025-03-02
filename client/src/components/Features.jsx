import React from 'react';
import { CloudSun, LineChart, Clock, Shield, UserPlus, Settings } from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Intelligent Event Planning
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Our platform combines AI, psychology, and data to create events that leave lasting impressions.
          </p>
        </div>

        {/* Weather-Mood Adapter Feature */}
        <div className="mt-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-5">
              <h3 className="text-2xl font-bold text-gray-900">
                Weather-Mood Adapter
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                Environmental factors have a profound impact on attendee experiences. Our Weather-Mood Adapter analyzes real-time weather data and uses behavioral psychology to suggest adjustments to your event elements.
              </p>
              
              <div className="mt-6 space-y-4">
                {[
                  "Automatically adjusts lighting based on weather patterns",
                  "Recommends music and activity changes to match environmental mood",
                  "Prepares contingency plans for weather shifts",
                  "Optimizes indoor climate controls for maximum comfort"
                ].map((item, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-500">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-10 lg:mt-0 lg:col-span-7">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-8 sm:p-10">
                  <div className="flex justify-center">
                    
                  </div>
                  <div className="mt-6 relative">
                    <img 
                      src="https://st2.depositphotos.com/1162190/6186/i/450/depositphotos_61868743-stock-photo-weather-forecast-concept.jpg" 
                      alt="Weather-Mood Adaptation visualization" 
                      className="rounded-lg shadow-md w-full" 
                    />
                    {/* Overlays to simulate UI elements */}
                    <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <CloudSun className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm font-medium text-gray-700">Partly Cloudy, 68°F</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">Mood impact: Contemplative</div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-indigo-600 bg-opacity-90 rounded-lg p-3 shadow-sm">
                      <div className="text-sm font-medium text-white">Recommended Adaptations</div>
                      <div className="mt-1 text-xs text-indigo-100">Increase warm lighting by 15%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emotional Journey Mapper Feature */}
        <div className="mt-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-8 sm:p-10">
                  <div className="relative">
                    <img 
                      src="https://static.vecteezy.com/system/resources/thumbnails/013/480/253/small/concept-of-good-and-impressive-customer-service-businessman-s-hand-selects-a-smiley-face-on-a-wooden-block-excellent-business-rating-experience-comments-from-customers-satisfaction-rating-photo.jpg" 
                      alt="Emotional Journey Map" 
                      className="rounded-lg shadow-md w-full" 
                    />
                    {/* Overlays to simulate UI elements */}
                    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                      
                    </div>
                    <div className="absolute top-1/4 left-1/4 bg-white bg-opacity-90 rounded-lg p-2 shadow-sm">
                      <div className="text-xs font-medium text-indigo-600">Excitement</div>
                    </div>
                    <div className="absolute top-1/3 left-1/2 bg-white bg-opacity-90 rounded-lg p-2 shadow-sm">
                      <div className="text-xs font-medium text-purple-600">Wonder</div>
                    </div>
                    <div className="absolute bottom-1/4 right-1/4 bg-white bg-opacity-90 rounded-lg p-2 shadow-sm">
                      <div className="text-xs font-medium text-blue-600">Inspiration</div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
            
            <div className="mt-10 lg:mt-0 lg:col-span-5">
              <h3 className="text-2xl font-bold text-gray-900">
                Emotional Journey Mapper
              </h3>
              <p className="mt-3 text-lg text-gray-500">
                Design your event flow to evoke specific emotional experiences, ensuring lasting impressions. Our mapper helps you plot the emotional arc of your event for maximum impact.
              </p>
              
              <div className="mt-6 space-y-4">
                {[
                  "Map out emotional touchpoints throughout your event",
                  "Incorporate psychological triggers at key moments",
                  "Create memorable high points and meaningful conclusions",
                  "Measure emotional response and optimize future events"
                ].map((item, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600">
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-500">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <Clock className="h-8 w-8" />,
              title: "Real-Time Adaptation",
              description: "Adjust event elements on the fly based on live feedback and changing conditions."
            },
            {
              icon: <Shield className="h-8 w-8" />,
              title: "Secure Administration",
              description: "Manage access, permissions, and sensitive data with enterprise-grade security."
            },
            {
              icon: <UserPlus className="h-8 w-8" />,
              title: "Client & Vendor Management",
              description: "Streamline communication and coordination with all stakeholders."
            },
            {
              icon: <Settings className="h-8 w-8" />,
              title: "Customizable Dashboard",
              description: "Configure your workspace to focus on what matters most to your events."
            },
            {
              icon: <LineChart className="h-8 w-8" />,
              title: "Advanced Analytics",
              description: "Gain insights into attendee behavior, engagement, and emotional response."
            },
            {
              icon: <CloudSun className="h-8 w-8" />,
              title: "Multi-location Support",
              description: "Manage simultaneous events across different locations and time zones."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center rounded-md bg-indigo-100 text-indigo-600">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;