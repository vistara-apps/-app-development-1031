import { create } from 'zustand';
import { User, Photo, Challenge, Gift, Filter } from '@/types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Photos state
  photos: Photo[];
  setPhotos: (photos: Photo[]) => void;
  addPhoto: (photo: Photo) => void;
  updatePhoto: (photoId: string, updatedPhoto: Partial<Photo>) => void;
  
  // Challenges state
  challenges: Challenge[];
  setChallenges: (challenges: Challenge[]) => void;
  activeChallenge: Challenge | null;
  setActiveChallenge: (challenge: Challenge | null) => void;
  
  // Submissions state
  challengeSubmissions: Photo[];
  setChallengeSubmissions: (photos: Photo[]) => void;
  
  // Filters state
  availableFilters: Filter[];
  setAvailableFilters: (filters: Filter[]) => void;
  selectedFilter: Filter | null;
  setSelectedFilter: (filter: Filter | null) => void;
  
  // Gifts state
  gifts: Record<string, Gift[]>; // photoId -> gifts
  addGift: (photoId: string, gift: Gift) => void;
  setGifts: (photoId: string, gifts: Gift[]) => void;
  
  // UI state
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  isEnhancing: boolean;
  setIsEnhancing: (isEnhancing: boolean) => void;
  currentStep: 'upload' | 'enhance' | 'submit' | 'browse';
  setCurrentStep: (step: 'upload' | 'enhance' | 'submit' | 'browse') => void;
}

export const useAppStore = create<AppState>((set) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),
  
  // Photos state
  photos: [],
  setPhotos: (photos) => set({ photos }),
  addPhoto: (photo) => set((state) => ({ photos: [...state.photos, photo] })),
  updatePhoto: (photoId, updatedPhoto) => set((state) => ({
    photos: state.photos.map((photo) => 
      photo.photoId === photoId ? { ...photo, ...updatedPhoto } : photo
    ),
  })),
  
  // Challenges state
  challenges: [],
  setChallenges: (challenges) => set({ challenges }),
  activeChallenge: null,
  setActiveChallenge: (activeChallenge) => set({ activeChallenge }),
  
  // Submissions state
  challengeSubmissions: [],
  setChallengeSubmissions: (challengeSubmissions) => set({ challengeSubmissions }),
  
  // Filters state
  availableFilters: [],
  setAvailableFilters: (availableFilters) => set({ availableFilters }),
  selectedFilter: null,
  setSelectedFilter: (selectedFilter) => set({ selectedFilter }),
  
  // Gifts state
  gifts: {},
  addGift: (photoId, gift) => set((state) => ({
    gifts: {
      ...state.gifts,
      [photoId]: [...(state.gifts[photoId] || []), gift],
    },
  })),
  setGifts: (photoId, gifts) => set((state) => ({
    gifts: {
      ...state.gifts,
      [photoId]: gifts,
    },
  })),
  
  // UI state
  isUploading: false,
  setIsUploading: (isUploading) => set({ isUploading }),
  isEnhancing: false,
  setIsEnhancing: (isEnhancing) => set({ isEnhancing }),
  currentStep: 'upload',
  setCurrentStep: (currentStep) => set({ currentStep }),
}));

