import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { getChallengeSubmissions, getGiftsByPhoto, sendGift } from '@/utils/api';
import { Photo, Gift, Treat } from '@/types';
import { formatPrice } from '@/utils/helpers';

interface SubmissionGalleryProps {
  challengeId: string;
}

const SubmissionGallery: React.FC<SubmissionGalleryProps> = ({ challengeId }) => {
  const { 
    challengeSubmissions, 
    setChallengeSubmissions,
    user,
    gifts,
    setGifts,
    addGift
  } = useAppStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showTreatModal, setShowTreatModal] = useState(false);
  const [sendingGift, setSendingGift] = useState(false);
  
  // Mock treats
  const treats: Treat[] = [
    { id: 'fish', name: 'Fish', icon: '🐟', price: 0.10 },
    { id: 'yarn', name: 'Yarn Ball', icon: '🧶', price: 0.10 },
    { id: 'mouse', name: 'Toy Mouse', icon: '🐭', price: 0.10 },
    { id: 'milk', name: 'Milk', icon: '🥛', price: 0.10 },
  ];
  
  // Fetch submissions for the challenge
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const submissions = await getChallengeSubmissions(challengeId);
        setChallengeSubmissions(submissions);
        
        // Fetch gifts for each submission
        submissions.forEach(async (photo) => {
          try {
            const photoGifts = await getGiftsByPhoto(photo.photoId);
            setGifts(photo.photoId, photoGifts);
          } catch (error) {
            console.error(`Error fetching gifts for photo ${photo.photoId}:`, error);
          }
        });
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setError('Failed to load submissions. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [challengeId, setChallengeSubmissions, setGifts]);
  
  const handleSendGift = async (treat: Treat) => {
    if (!selectedPhoto || !user) return;
    
    try {
      setSendingGift(true);
      
      // In a real implementation, we would handle the payment here
      console.log(`Processing payment of ${formatPrice(treat.price)} for ${treat.name} treat`);
      
      // Send the gift
      const gift = await sendGift(user.farcasterId, selectedPhoto.photoId, treat.id);
      
      // Add the gift to the store
      addGift(selectedPhoto.photoId, gift);
      
      // Close the modal
      setShowTreatModal(false);
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Error sending gift:', error);
      alert('Failed to send gift. Please try again.');
    } finally {
      setSendingGift(false);
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading submissions...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    );
  }
  
  if (challengeSubmissions.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No submissions yet. Be the first to submit!</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {challengeSubmissions.map((photo) => (
          <div key={photo.photoId} className="card">
            <img 
              src={photo.enhancedImageUrl || photo.imageUrl} 
              alt="Cat submission" 
              className="w-full h-40 object-cover rounded-md mb-2" 
            />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {/* Display treats/gifts */}
                {gifts[photo.photoId]?.map((gift, index) => (
                  <span key={gift.giftId} className="text-lg mr-1">
                    {treats.find(t => t.id === gift.treatType)?.icon || '🎁'}
                  </span>
                ))}
                
                {/* Show gift count if more than 3 */}
                {gifts[photo.photoId]?.length > 3 && (
                  <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">
                    +{gifts[photo.photoId].length - 3}
                  </span>
                )}
              </div>
              
              <button
                onClick={() => {
                  setSelectedPhoto(photo);
                  setShowTreatModal(true);
                }}
                className="text-xs bg-accent text-text px-2 py-1 rounded-md"
              >
                Gift Treat
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Treat selection modal */}
      {showTreatModal && selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h3 className="text-display mb-4">Send a Treat</h3>
            
            <div className="mb-4">
              <img 
                src={selectedPhoto.enhancedImageUrl || selectedPhoto.imageUrl} 
                alt="Selected cat" 
                className="w-full h-40 object-cover rounded-md" 
              />
            </div>
            
            <p className="text-sm mb-4">
              Select a treat to send to this photo:
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {treats.map((treat) => (
                <button
                  key={treat.id}
                  onClick={() => handleSendGift(treat)}
                  disabled={sendingGift}
                  className="flex flex-col items-center justify-center p-3 border rounded-md hover:bg-gray-50"
                >
                  <span className="text-2xl mb-1">{treat.icon}</span>
                  <span className="text-sm font-medium">{treat.name}</span>
                  <span className="text-xs text-gray-500">{formatPrice(treat.price)}</span>
                </button>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowTreatModal(false);
                  setSelectedPhoto(null);
                }}
                className="btn-secondary"
                disabled={sendingGift}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionGallery;

