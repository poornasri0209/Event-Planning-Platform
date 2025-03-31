// LineChart.jsx
import React from 'react';

const LineChart = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 250">
      <g transform="translate(40, 20)">
        <line x1="0" y1="200" x2="320" y2="200" stroke="#e5e7eb" strokeWidth="1" />
        
        <g transform="translate(0, 200)">
          <text x="0" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Jan</text>
          <text x="60" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Feb</text>
          <text x="120" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Mar</text>
          <text x="180" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Apr</text>
          <text x="240" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">May</text>
          <text x="300" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Jun</text>
        </g>
        
        <g>
          <text x="-10" y="200" textAnchor="end" fontSize="12" fill="#6b7280">0</text>
          <text x="-10" y="150" textAnchor="end" fontSize="12" fill="#6b7280">200</text>
          <text x="-10" y="100" textAnchor="end" fontSize="12" fill="#6b7280">400</text>
          <text x="-10" y="50" textAnchor="end" fontSize="12" fill="#6b7280">600</text>
          <text x="-10" y="10" textAnchor="end" fontSize="12" fill="#6b7280">800</text>
        </g>
        
        <polyline 
          points="0,180 60,150 120,170 180,120 240,90 300,60" 
          fill="none" 
          stroke="#4f46e5" 
          strokeWidth="3" 
        />
        
        <circle cx="0" cy="180" r="4" fill="#4f46e5" />
        <circle cx="60" cy="150" r="4" fill="#4f46e5" />
        <circle cx="120" cy="170" r="4" fill="#4f46e5" />
        <circle cx="180" cy="120" r="4" fill="#4f46e5" />
        <circle cx="240" cy="90" r="4" fill="#4f46e5" />
        <circle cx="300" cy="60" r="4" fill="#4f46e5" />
      </g>
    </svg>
  );
};

export default LineChart;

