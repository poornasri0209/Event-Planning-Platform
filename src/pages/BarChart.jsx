// BarChart.jsx
import React from 'react';

const BarChart = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 250">
      <g transform="translate(40, 20)">
        <line x1="0" y1="200" x2="320" y2="200" stroke="#e5e7eb" strokeWidth="1" />
        
        <g transform="translate(0, 200)">
          <text x="20" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Q1</text>
          <text x="80" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Q2</text>
          <text x="140" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Q3</text>
          <text x="200" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Q4</text>
          <text x="260" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Q1</text>
        </g>
        
        <g>
          <text x="-10" y="200" textAnchor="end" fontSize="12" fill="#6b7280">0</text>
          <text x="-10" y="150" textAnchor="end" fontSize="12" fill="#6b7280">25K</text>
          <text x="-10" y="100" textAnchor="end" fontSize="12" fill="#6b7280">50K</text>
          <text x="-10" y="50" textAnchor="end" fontSize="12" fill="#6b7280">75K</text>
          <text x="-10" y="10" textAnchor="end" fontSize="12" fill="#6b7280">100K</text>
        </g>
        
        <rect x="10" y="120" width="20" height="80" fill="#818cf8" rx="2" />
        <rect x="70" y="100" width="20" height="100" fill="#818cf8" rx="2" />
        <rect x="130" y="80" width="20" height="120" fill="#818cf8" rx="2" />
        <rect x="190" y="60" width="20" height="140" fill="#818cf8" rx="2" />
        <rect x="250" y="40" width="20" height="160" fill="#818cf8" rx="2" />
      </g>
    </svg>
  );
};

export default BarChart;

