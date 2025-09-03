import { useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { uploadPhoto } from '@/utils/api';
import { Photo } from '@/types';

export const usePhotoUpload = () => {
  const { user, addPhoto, setIsUploading } = useAppStore();
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleFileSelect = useCallback((file: File) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setError(null);
    
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, []);
  
  const uploadSelectedPhoto = useCallback(async (file: File): Promise<Photo | null> => {
    if (!user) {
      setError('You must be logged in to upload photos');
      return null;
    }
    
    try {
      setIsUploading(true);
      setError(null);
      
      const uploadedPhoto = await uploadPhoto(file, user.farcasterId);
      
      // Add the photo to the store
      addPhoto(uploadedPhoto);
      
      return uploadedPhoto;
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Failed to upload photo. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [user, addPhoto, setIsUploading]);
  
  return {
    previewUrl,
    error,
    handleFileSelect,
    uploadSelectedPhoto,
    clearPreview: () => setPreviewUrl(null),
    clearError: () => setError(null),
  };
};

