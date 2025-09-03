'use client';

import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAppStore } from '@/lib/store';
import { getActiveChallenges } from '@/utils/api';
import FrameContainer from '@/components/FrameContainer';
import Header from '@/components/Header';
import ChallengeCard from '@/components/ChallengeCard';
import PhotoUploader from '@/components/PhotoUploader';
import FilterSelector from '@/components/FilterSelector';
import SubmissionGallery from '@/components/SubmissionGallery';
import ChallengeSubmission from '@/components/ChallengeSubmission';

export default function Home() {
  const { user, authenticated, login } = usePrivy();
  const { 
    challenges, 
    setChallenges, 
    activeChallenge, 
    setActiveChallenge,
    currentStep,
    setCurrentStep
  } = useAppStore();

  // Fetch active challenges on component mount
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const activeChallenges = await getActiveChallenges();
        setChallenges(activeChallenges);
        
        // Set the first challenge as active if there are any
        if (activeChallenges.length > 0 && !activeChallenge) {
          setActiveChallenge(activeChallenges[0]);
        }
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    };

    fetchChallenges();
  }, [setChallenges, activeChallenge, setActiveChallenge]);

  // Render login screen if not authenticated
  if (!authenticated) {
    return (
      <FrameContainer>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-display mb-4">Welcome to FurryFrame</h1>
          <p className="text-body mb-8 text-center">
            Your Farcaster frame for crafting and sharing purrfect cat moments.
          </p>
          <button 
            onClick={() => login()} 
            className="btn-primary"
          >
            Connect with Farcaster
          </button>
        </div>
      </FrameContainer>
    );
  }

  return (
    <FrameContainer>
      <Header />
      
      {currentStep === 'browse' && (
        <div className="mt-6">
          <h2 className="text-display mb-4">Active Challenges</h2>
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <ChallengeCard 
                key={challenge.challengeId} 
                challenge={challenge}
                isActive={activeChallenge?.challengeId === challenge.challengeId}
                onSelect={() => setActiveChallenge(challenge)}
              />
            ))}
          </div>
          
          {activeChallenge && (
            <div className="mt-8">
              <h2 className="text-display mb-4">Submissions</h2>
              <SubmissionGallery challengeId={activeChallenge.challengeId} />
              
              <div className="mt-6">
                <button 
                  onClick={() => setCurrentStep('upload')}
                  className="btn-primary w-full"
                >
                  Submit Your Cat Photo
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {currentStep === 'upload' && (
        <PhotoUploader onComplete={() => setCurrentStep('enhance')} />
      )}
      
      {currentStep === 'enhance' && (
        <FilterSelector 
          onComplete={() => setCurrentStep('submit')}
          onBack={() => setCurrentStep('upload')}
        />
      )}
      
      {currentStep === 'submit' && (
        <ChallengeSubmission 
          onComplete={() => setCurrentStep('browse')}
          onBack={() => setCurrentStep('enhance')}
        />
      )}
    </FrameContainer>
  );
}
