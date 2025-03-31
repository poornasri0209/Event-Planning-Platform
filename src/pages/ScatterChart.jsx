import React from 'react';

const ScatterChart = () => {
  const points = [
    { x: 30, y: 50, weather: 'Sunny', mood: 'Energetic' },
    { x: 70, y: 80, weather: 'Sunny', mood: 'Joyful' },
    { x: 120, y: 40, weather: 'Sunny', mood: 'Excited' },
    { x: 160, y: 100, weather: 'Sunny', mood: 'Inspired' },
    { x: 50, y: 150, weather: 'Rainy', mood: 'Reflective' },
    { x: 100, y: 130, weather: 'Rainy', mood: 'Calm' },
    { x: 140, y: 160, weather: 'Rainy', mood: 'Nostalgic' },
    { x: 200, y: 120, weather: 'Rainy', mood: 'Relaxed' },
    { x: 230, y: 70, weather: 'Cloudy', mood: 'Focused' },
    { x: 260, y: 110, weather: 'Cloudy', mood: 'Thoughtful' },
    { x: 220, y: 30, weather: 'Cloudy', mood: 'Creative' },
    { x: 190, y: 60, weather: 'Cloudy', mood: 'Productive' },
  ];
  
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 250">
      <g transform="translate(40, 20)">
        <line x1="0" y1="200" x2="320" y2="200" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="200" stroke="#e5e7eb" strokeWidth="1" />
        
        <text x="160" y="230" textAnchor="middle" fontSize="12" fill="#6b7280">Weather Conditions</text>
        <text x="-30" y="100" textAnchor="middle" fontSize="12" fill="#6b7280" transform="rotate(-90, -30, 100)">Mood Impact</text>
        
        {points.map((point, i) => (
          <g key={i}>
            <circle 
              cx={point.x} 
              cy={point.y} 
              r="6" 
              fill={
                point.weather === 'Sunny' ? '#fcd34d' : 
                point.weather === 'Rainy' ? '#60a5fa' : 
                '#9ca3af'
              }
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          </g>
        ))}
        
        <g transform="translate(200, 20)">
          <circle cx="0" cy="0" r="6" fill="#fcd34d" stroke="#ffffff" strokeWidth="1.5" />
          <text x="10" y="4" fontSize="10" fill="#6b7280">Sunny</text>
          
          <circle cx="0" cy="20" r="6" fill="#60a5fa" stroke="#ffffff" strokeWidth="1.5" />
          <text x="10" y="24" fontSize="10" fill="#6b7280">Rainy</text>
          
          <circle cx="0" cy="40" r="6" fill="#9ca3af" stroke="#ffffff" strokeWidth="1.5" />
          <text x="10" y="44" fontSize="10" fill="#6b7280">Cloudy</text>
        </g>
      </g>
    </svg>
  );
};

export default ScatterChart;