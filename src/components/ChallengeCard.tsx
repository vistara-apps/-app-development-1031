import React from 'react';
import { Challenge } from '@/types';
import { formatDate, getTimeRemaining, isChallengeActive } from '@/utils/helpers';

interface ChallengeCardProps {
  challenge: Challenge;
  isActive: boolean;
  onSelect: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  challenge, 
  isActive,
  onSelect 
}) => {
  const { title, description, startDate, endDate, prompt } = challenge;
  const isChallengeCurrentlyActive = isChallengeActive(startDate, endDate);
  const timeRemaining = getTimeRemaining(endDate);
  
  return (
    <div 
      className={`card cursor-pointer transition-all ${
        isActive ? 'ring-2 ring-primary' : 'hover:shadow-lg'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          isChallengeCurrentlyActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {isChallengeCurrentlyActive ? 'Active' : 'Ended'}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      
      <div className="bg-gray-50 p-3 rounded-md mb-3">
        <p className="text-sm font-medium">Challenge Prompt:</p>
        <p className="text-sm italic">"{prompt}"</p>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>Started: {formatDate(startDate)}</span>
        <span>{timeRemaining}</span>
      </div>
    </div>
  );
};

export default ChallengeCard;
