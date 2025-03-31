// RadarChart.jsx
import React from 'react';

const RadarChart = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 250">
      <g transform="translate(200, 125)">
        <polygon points="0,-100 86.6,-50 86.6,50 0,100 -86.6,50 -86.6,-50" fill="none" stroke="#e5e7eb" strokeWidth="1" />
        <polygon points="0,-75 65,-37.5 65,37.5 0,75 -65,37.5 -65,-37.5" fill="none" stroke="#e5e7eb" strokeWidth="1" />
        <polygon points="0,-50 43.3,-25 43.3,25 0,50 -43.3,25 -43.3,-25" fill="none" stroke="#e5e7eb" strokeWidth="1" />
        <polygon points="0,-25 21.7,-12.5 21.7,12.5 0,25 -21.7,12.5 -21.7,-12.5" fill="none" stroke="#e5e7eb" strokeWidth="1" />
        
        <line x1="0" y1="0" x2="0" y2="-100" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="0" y1="0" x2="86.6" y2="-50" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="0" y1="0" x2="86.6" y2="50" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="100" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="0" y1="0" x2="-86.6" y2="50" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="0" y1="0" x2="-86.6" y2="-50" stroke="#e5e7eb" strokeWidth="1" />
        
        <text x="0" y="-110" textAnchor="middle" fontSize="12" fill="#6b7280">Excitement</text>
        <text x="96" y="-50" textAnchor="start" fontSize="12" fill="#6b7280">Wonder</text>
        <text x="96" y="55" textAnchor="start" fontSize="12" fill="#6b7280">Joy</text>
        <text x="0" y="115" textAnchor="middle" fontSize="12" fill="#6b7280">Satisfaction</text>
        <text x="-96" y="55" textAnchor="end" fontSize="12" fill="#6b7280">Trust</text>
        <text x="-96" y="-50" textAnchor="end" fontSize="12" fill="#6b7280">Anticipation</text>
        
        <polygon 
          points="0,-80 69.3,-30 60.6,40 0,70 -73.6,35 -60.6,-40" 
          fill="rgba(79, 70, 229, 0.2)" 
          stroke="#4f46e5" 
          strokeWidth="2" 
        />
        
        <circle cx="0" cy="-80" r="4" fill="#4f46e5" />
        <circle cx="69.3" cy="-30" r="4" fill="#4f46e5" />
        <circle cx="60.6" cy="40" r="4" fill="#4f46e5" />
        <circle cx="0" cy="70" r="4" fill="#4f46e5" />
        <circle cx="-73.6" cy="35" r="4" fill="#4f46e5" />
        <circle cx="-60.6" cy="-40" r="4" fill="#4f46e5" />
      </g>
    </svg>
  );
};

export default RadarChart;

