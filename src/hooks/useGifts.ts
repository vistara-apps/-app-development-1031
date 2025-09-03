import { useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { sendGift, getGiftsByPhoto } from '@/utils/api';
import { Treat } from '@/types';

export const useGifts = () => {
  const { user, gifts, addGift, setGifts } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mock treats
  const treats: Treat[] = [
    { id: 'fish', name: 'Fish', icon: '🐟', price: 0.10 },
    { id: 'yarn', name: 'Yarn Ball', icon: '🧶', price: 0.10 },
    { id: 'mouse', name: 'Toy Mouse', icon: '🐭', price: 0.10 },
    { id: 'milk', name: 'Milk', icon: '🥛', price: 0.10 },
  ];
  
  // Fetch gifts for a photo
  const fetchGifts = useCallback(async (photoId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const photoGifts = await getGiftsByPhoto(photoId);
      setGifts(photoId, photoGifts);
      
      return photoGifts;
    } catch (error) {
      console.error('Error fetching gifts:', error);
      setError('Failed to load gifts. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  }, [setGifts]);
  
  // Send a gift
  const sendTreat = useCallback(async (photoId: string, treatId: string) => {
    if (!user) {
      setError('You must be logged in to send treats');
      return false;
    }
    
    try {
      setSending(true);
      setError(null);
      
      // In a real implementation, we would handle the payment here
      const treat = treats.find(t => t.id === treatId);
      if (treat) {
        console.log(`Processing payment of $${treat.price.toFixed(2)} for ${treat.name} treat`);
      }
      
      // Send the gift
      const gift = await sendGift(user.farcasterId, photoId, treatId);
      
      // Add the gift to the store
      addGift(photoId, gift);
      
      return true;
    } catch (error) {
      console.error('Error sending gift:', error);
      setError('Failed to send treat. Please try again.');
      return false;
    } finally {
      setSending(false);
    }
  }, [user, treats, addGift]);
  
  // Get gifts for a photo
  const getGiftsForPhoto = useCallback((photoId: string) => {
    return gifts[photoId] || [];
  }, [gifts]);
  
  return {
    treats,
    loading,
    sending,
    error,
    fetchGifts,
    sendTreat,
    getGiftsForPhoto,
    clearError: () => setError(null),
  };
};

