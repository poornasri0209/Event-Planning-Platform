import React from 'react';
import { Cloud, Heart, Calendar, PieChart, Zap, Users } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Weather-Mood Adapter",
      description: "Our AI analyzes weather patterns and adjusts event elements to optimize attendee mood and engagement based on environmental psychology.",
      highlight: true
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Emotional Journey Mapper",
      description: "Design your event flow to create specific emotional experiences, ensuring lasting impressions and memorable moments.",
      highlight: true
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Event Creation & Management",
      description: "Intuitive tools for planning, scheduling, and managing all aspects of your event with AI-assisted recommendations.",
    },
    {
      icon: <PieChart className="h-8 w-8" />,
      title: "Analytics & Reporting",
      description: "Comprehensive data insights on attendee engagement, emotion tracking, and event performance metrics.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-time Adaptations",
      description: "Dynamic event adjustments based on live feedback and environmental changes to maximize impact.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Attendee Experience Design",
      description: "Personalized touchpoints and interactions crafted to resonate with your specific audience.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Services</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            AI-Powered Event Solutions
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Create emotionally resonant events with our suite of intelligent planning tools.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`relative p-6 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                service.highlight 
                  ? 'border-2 border-indigo-500 hover:-translate-y-1' 
                  : 'hover:-translate-y-1'
              }`}
            >
              {service.highlight && (
                <div className="absolute -top-3 -right-3 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  Featured
                </div>
              )}
              <div className={`w-12 h-12 flex items-center justify-center rounded-full ${
                service.highlight 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {service.icon}
              </div>
              <h3 className="mt-4 text-xl font-medium text-gray-900">{service.title}</h3>
              <p className="mt-2 text-gray-500">{service.description}</p>
              <div className="mt-6">
                <a 
                  href="#" 
                  className={`inline-flex items-center text-sm font-medium ${
                    service.highlight 
                      ? 'text-indigo-600 hover:text-indigo-800' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Learn more
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;