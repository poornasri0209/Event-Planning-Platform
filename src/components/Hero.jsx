import React from 'react';
import { Calendar, Users, TrendingUp } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
      {/* Abstract design elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-indigo-400 rounded-full opacity-10 blur-xl"></div>
      </div>

      {/* Hero content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
              <span className="block mb-2">Transform Your</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
                Event Experience
              </span>
            </h1>
            <p className="mt-6 text-xl leading-relaxed">
              Sentinent Stories uses AI and behavioral psychology to create memorable events that resonate with your audience, adapting to their emotions and the environment.
            </p>
            <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <a
                  href="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-indigo-600 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </a>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <a
                  href="#demo"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-700 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10"
                >
                  Watch Demo
                </a>
              </div>
            </div>
          </div>

          {/* Stats and highlights */}
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-8 sm:p-10">
                <div className="flex items-center justify-center">
                  <img 
                    src="https://www.oyorooms.com/blog/wp-content/uploads/2018/02/event.jpg" 
                    alt="Event illustration" 
                    className="h-56 w-full object-cover rounded-lg shadow-md" 
                  />
                </div>
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-white bg-opacity-20 rounded-lg p-5 backdrop-filter backdrop-blur-sm">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 bg-opacity-80 mx-auto">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <p className="mt-4 text-lg font-medium text-white text-center">
                      200+
                    </p>
                    <p className="mt-1 text-sm text-center text-indigo-100">
                      Events Planned
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-5 backdrop-filter backdrop-blur-sm">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 bg-opacity-80 mx-auto">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <p className="mt-4 text-lg font-medium text-white text-center">
                      50,000+
                    </p>
                    <p className="mt-1 text-sm text-center text-indigo-100">
                      Happy Attendees
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-5 backdrop-filter backdrop-blur-sm">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 bg-opacity-80 mx-auto">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <p className="mt-4 text-lg font-medium text-white text-center">
                      92%
                    </p>
                    <p className="mt-1 text-sm text-center text-indigo-100">
                      Satisfaction Rate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 120L48 105C96 90 192 60 288 45C384 30 480 30 576 37.5C672 45 768 60 864 75C960 90 1056 105 1152 105C1248 105 1344 90 1392 82.5L1440 75V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="white"/>
        </svg>
      </div>
    </div>
  );
};

export default Hero;