import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { enhancePhoto } from '@/utils/api';
import { Filter } from '@/types';
import { formatPrice } from '@/utils/helpers';

interface FilterSelectorProps {
  onComplete: () => void;
  onBack: () => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({ onComplete, onBack }) => {
  const { 
    photos, 
    updatePhoto, 
    availableFilters, 
    setAvailableFilters,
    selectedFilter,
    setSelectedFilter,
    isEnhancing,
    setIsEnhancing
  } = useAppStore();
  
  const [error, setError] = useState<string | null>(null);
  
  // Get the most recently added photo
  const photo = photos.length > 0 ? photos[photos.length - 1] : null;
  
  // Mock filters for demo
  useEffect(() => {
    const mockFilters: Filter[] = [
      {
        id: 'natural',
        name: 'Natural',
        description: 'Enhances colors and sharpness while maintaining a natural look',
        isPremium: false,
      },
      {
        id: 'vibrant',
        name: 'Vibrant',
        description: 'Boosts colors and contrast for a more vivid appearance',
        isPremium: false,
      },
      {
        id: 'soft',
        name: 'Soft',
        description: 'Adds a gentle, dreamy quality to your photo',
        isPremium: false,
      },
      {
        id: 'dramatic',
        name: 'Dramatic',
        description: 'High contrast with enhanced shadows and highlights',
        isPremium: true,
        price: 0.25,
      },
      {
        id: 'vintage',
        name: 'Vintage',
        description: 'Classic film-inspired look with warm tones',
        isPremium: true,
        price: 0.25,
      },
    ];
    
    setAvailableFilters(mockFilters);
  }, [setAvailableFilters]);
  
  const handleSelectFilter = (filter: Filter) => {
    setSelectedFilter(filter);
  };
  
  const handleApplyFilter = async () => {
    if (!photo || !selectedFilter) return;
    
    try {
      setIsEnhancing(true);
      setError(null);
      
      // If premium filter, handle payment (mock for now)
      if (selectedFilter.isPremium) {
        // In a real implementation, we would handle the payment here
        console.log('Processing payment for premium filter:', selectedFilter.name);
      }
      
      // Apply the filter
      const enhancedPhoto = await enhancePhoto(
        photo.photoId,
        selectedFilter.id,
        selectedFilter.isPremium
      );
      
      // Update the photo in the store
      updatePhoto(photo.photoId, enhancedPhoto);
      
      // Move to the next step
      onComplete();
    } catch (error) {
      console.error('Error applying filter:', error);
      setError('Failed to apply filter. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };
  
  if (!photo) {
    return (
      <div className="mt-6 text-center">
        <p>No photo available. Please upload a photo first.</p>
        <button 
          onClick={onBack}
          className="btn-primary mt-4"
        >
          Back to Upload
        </button>
      </div>
    );
  }
  
  return (
    <div className="mt-6">
      <h2 className="text-display mb-4">Enhance Your Photo</h2>
      
      <div className="mb-6">
        <img 
          src={photo.enhancedImageUrl || photo.imageUrl} 
          alt="Your cat" 
          className="w-full rounded-lg shadow-card" 
        />
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Select a Filter</h3>
        <div className="grid grid-cols-2 gap-3">
          {availableFilters.map((filter) => (
            <div 
              key={filter.id}
              onClick={() => handleSelectFilter(filter)}
              className={`card cursor-pointer transition-all ${
                selectedFilter?.id === filter.id 
                  ? 'ring-2 ring-primary' 
                  : 'hover:shadow-lg'
              }`}
            >
              <h4 className="font-medium flex items-center">
                {filter.name}
                {filter.isPremium && (
                  <span className="ml-2 text-xs bg-accent text-text px-1.5 py-0.5 rounded-full">
                    Premium
                  </span>
                )}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {filter.description}
              </p>
              {filter.isPremium && filter.price && (
                <p className="text-sm font-medium mt-2">
                  {formatPrice(filter.price)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {error && (
        <p className="text-red-500 mt-2 text-sm">{error}</p>
      )}
      
      <div className="flex space-x-4 mt-6">
        <button 
          onClick={onBack}
          className="btn-secondary"
        >
          Back
        </button>
        <button 
          onClick={handleApplyFilter}
          disabled={!selectedFilter || isEnhancing}
          className={`btn-primary flex-1 ${(!selectedFilter || isEnhancing) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isEnhancing ? 'Enhancing...' : 'Apply Filter'}
        </button>
      </div>
    </div>
  );
};

export default FilterSelector;

