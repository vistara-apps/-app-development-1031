'use client';

import { useState } from 'react';
import VibeTag from './VibeTag';

export default function RecommendationCard({ 
  title, 
  description, 
  venueName, 
  vibeTags = [], 
  trendScore = 0 
}) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div 
      className={`recommendation-card ${expanded ? 'expanded' : 'collapsed'}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
          {trendScore}%
        </div>
      </div>
      
      <p className="text-sm mb-4">{description}</p>
      
      <div className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Venue:</span> {venueName}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {vibeTags.map((tag, index) => (
          <VibeTag key={index} label={tag} />
        ))}
      </div>
      
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="text-primary text-sm font-medium">
            View on Map
          </button>
        </div>
      )}
    </div>
  );
}

