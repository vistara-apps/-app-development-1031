import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { usePrivy } from '@privy-io/react-auth';
import { useAppStore } from '@/lib/store';
import { uploadPhoto } from '@/utils/api';

interface PhotoUploaderProps {
  onComplete: () => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onComplete }) => {
  const { user: privyUser } = usePrivy();
  const { 
    user, 
    addPhoto, 
    isUploading, 
    setIsUploading,
    setCurrentStep
  } = useAppStore();
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
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
    
    // Upload the file when user clicks "Continue"
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 1,
  });
  
  const handleUpload = async () => {
    if (!previewUrl || !user || !privyUser) return;
    
    try {
      setIsUploading(true);
      
      // Convert data URL to File object
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const file = new File([blob], 'cat-photo.jpg', { type: 'image/jpeg' });
      
      // Upload the photo
      const uploadedPhoto = await uploadPhoto(file, user.farcasterId);
      
      // Add the photo to the store
      addPhoto(uploadedPhoto);
      
      // Move to the next step
      onComplete();
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="mt-6">
      <h2 className="text-display mb-4">Upload Your Cat Photo</h2>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        
        {previewUrl ? (
          <div className="flex flex-col items-center">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-64 max-w-full rounded-md mb-4" 
            />
            <p className="text-sm text-gray-500">
              Click or drag to replace this image
            </p>
          </div>
        ) : (
          <div className="py-8">
            <p className="text-body mb-2">
              {isDragActive ? 'Drop your cat photo here' : 'Drag & drop your cat photo here, or click to select'}
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, PNG, GIF (max 5MB)
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 mt-2 text-sm">{error}</p>
      )}
      
      <div className="flex space-x-4 mt-6">
        <button 
          onClick={() => setCurrentStep('browse')}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button 
          onClick={handleUpload}
          disabled={!previewUrl || isUploading}
          className={`btn-primary flex-1 ${(!previewUrl || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? 'Uploading...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default PhotoUploader;

