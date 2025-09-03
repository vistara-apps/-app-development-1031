import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useChallenges } from '@/hooks/useChallenges';
import { formatDate, getTimeRemaining } from '@/utils/helpers';

interface ChallengeSubmissionProps {
  onComplete: () => void;
  onBack: () => void;
}

const ChallengeSubmission: React.FC<ChallengeSubmissionProps> = ({ 
  onComplete, 
  onBack 
}) => {
  const { photos, activeChallenge } = useAppStore();
  const { submitPhoto, submitting, error, clearError } = useChallenges();
  const [caption, setCaption] = useState('');
  
  // Get the most recently added photo
  const photo = photos.length > 0 ? photos[photos.length - 1] : null;
  
  if (!photo || !activeChallenge) {
    return (
      <div className="mt-6 text-center">
        <p>No photo or active challenge available.</p>
        <button 
          onClick={onBack}
          className="btn-primary mt-4"
        >
          Back
        </button>
      </div>
    );
  }
  
  const handleSubmit = async () => {
    if (await submitPhoto(photo.photoId, activeChallenge.challengeId)) {
      onComplete();
    }
  };
  
  return (
    <div className="mt-6">
      <h2 className="text-display mb-4">Submit to Challenge</h2>
      
      <div className="card mb-6">
        <h3 className="font-medium mb-2">{activeChallenge.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{activeChallenge.description}</p>
        
        <div className="bg-gray-50 p-3 rounded-md mb-3">
          <p className="text-sm font-medium">Challenge Prompt:</p>
          <p className="text-sm italic">"{activeChallenge.prompt}"</p>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>Started: {formatDate(activeChallenge.startDate)}</span>
          <span>{getTimeRemaining(activeChallenge.endDate)}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <img 
          src={photo.enhancedImageUrl || photo.imageUrl} 
          alt="Your cat" 
          className="w-full rounded-lg shadow-card mb-4" 
        />
        
        <div className="mt-4">
          <label htmlFor="caption" className="block text-sm font-medium mb-2">
            Add a caption (optional)
          </label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            placeholder="Tell us about your cat..."
          />
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
          <p>{error}</p>
          <button 
            onClick={clearError}
            className="text-sm underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div className="flex space-x-4 mt-6">
        <button 
          onClick={onBack}
          className="btn-secondary"
        >
          Back
        </button>
        <button 
          onClick={handleSubmit}
          disabled={submitting}
          className={`btn-primary flex-1 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {submitting ? 'Submitting...' : 'Submit to Challenge'}
        </button>
      </div>
    </div>
  );
};

export default ChallengeSubmission;

