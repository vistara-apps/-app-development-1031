import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { getActiveChallenges, getChallengeSubmissions, submitPhotoToChallenge } from '@/utils/api';
import { Challenge, Photo } from '@/types';

export const useChallenges = () => {
  const { 
    challenges, 
    setChallenges, 
    activeChallenge, 
    setActiveChallenge,
    challengeSubmissions,
    setChallengeSubmissions,
    user
  } = useAppStore();
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch active challenges
  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const activeChallenges = await getActiveChallenges();
      setChallenges(activeChallenges);
      
      // Set the first challenge as active if there are any and no active challenge is set
      if (activeChallenges.length > 0 && !activeChallenge) {
        setActiveChallenge(activeChallenges[0]);
      }
      
      return activeChallenges;
    } catch (error) {
      console.error('Error fetching challenges:', error);
      setError('Failed to load challenges. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  }, [setChallenges, activeChallenge, setActiveChallenge]);
  
  // Fetch submissions for a challenge
  const fetchSubmissions = useCallback(async (challengeId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const submissions = await getChallengeSubmissions(challengeId);
      setChallengeSubmissions(submissions);
      
      return submissions;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('Failed to load submissions. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  }, [setChallengeSubmissions]);
  
  // Submit a photo to a challenge
  const submitPhoto = useCallback(async (photoId: string, challengeId: string) => {
    if (!user) {
      setError('You must be logged in to submit photos');
      return false;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      await submitPhotoToChallenge(photoId, challengeId, user.farcasterId);
      
      // Refresh submissions
      await fetchSubmissions(challengeId);
      
      return true;
    } catch (error) {
      console.error('Error submitting photo:', error);
      setError('Failed to submit photo. Please try again.');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [user, fetchSubmissions]);
  
  // Select a challenge
  const selectChallenge = useCallback((challenge: Challenge) => {
    setActiveChallenge(challenge);
    fetchSubmissions(challenge.challengeId);
  }, [setActiveChallenge, fetchSubmissions]);
  
  // Load initial data
  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);
  
  // Load submissions when active challenge changes
  useEffect(() => {
    if (activeChallenge) {
      fetchSubmissions(activeChallenge.challengeId);
    }
  }, [activeChallenge, fetchSubmissions]);
  
  return {
    challenges,
    activeChallenge,
    challengeSubmissions,
    loading,
    submitting,
    error,
    fetchChallenges,
    fetchSubmissions,
    submitPhoto,
    selectChallenge,
    clearError: () => setError(null),
  };
};

