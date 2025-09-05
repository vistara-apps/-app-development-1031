import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, RecordingState, LocationData } from '@/types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Location state
  location: LocationData | null;
  setLocation: (location: LocationData | null) => void;
  
  // Recording state
  recording: RecordingState;
  setRecording: (recording: RecordingState) => void;
  startRecording: () => void;
  stopRecording: () => void;
  
  // UI state
  selectedState: string;
  setSelectedState: (state: string) => void;
  
  language: 'en' | 'es';
  setLanguage: (language: 'en' | 'es') => void;
  
  isOnboarded: boolean;
  setIsOnboarded: (onboarded: boolean) => void;
  
  // Emergency contacts
  emergencyContacts: string[];
  setEmergencyContacts: (contacts: string[]) => void;
  addEmergencyContact: (contact: string) => void;
  removeEmergencyContact: (contact: string) => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Error state
  error: string | null;
  setError: (error: string | null) => void;
  
  // Clear all data (for logout)
  clearAll: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      location: null,
      recording: {
        isRecording: false,
        duration: 0,
      },
      selectedState: '',
      language: 'en',
      isOnboarded: false,
      emergencyContacts: [],
      isLoading: false,
      error: null,

      // User actions
      setUser: (user) => set({ user }),

      // Location actions
      setLocation: (location) => set({ location }),

      // Recording actions
      setRecording: (recording) => set({ recording }),
      
      startRecording: () => {
        set({
          recording: {
            isRecording: true,
            startTime: new Date(),
            duration: 0,
          }
        });
      },
      
      stopRecording: () => {
        const { recording } = get();
        set({
          recording: {
            ...recording,
            isRecording: false,
          }
        });
      },

      // UI actions
      setSelectedState: (selectedState) => set({ selectedState }),
      setLanguage: (language) => set({ language }),
      setIsOnboarded: (isOnboarded) => set({ isOnboarded }),

      // Emergency contacts actions
      setEmergencyContacts: (emergencyContacts) => set({ emergencyContacts }),
      
      addEmergencyContact: (contact) => {
        const { emergencyContacts } = get();
        if (!emergencyContacts.includes(contact)) {
          set({ emergencyContacts: [...emergencyContacts, contact] });
        }
      },
      
      removeEmergencyContact: (contact) => {
        const { emergencyContacts } = get();
        set({ 
          emergencyContacts: emergencyContacts.filter(c => c !== contact) 
        });
      },

      // Loading and error actions
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Clear all data
      clearAll: () => set({
        user: null,
        location: null,
        recording: {
          isRecording: false,
          duration: 0,
        },
        selectedState: '',
        language: 'en',
        isOnboarded: false,
        emergencyContacts: [],
        isLoading: false,
        error: null,
      }),
    }),
    {
      name: 'legalshield-ai-storage',
      partialize: (state) => ({
        user: state.user,
        selectedState: state.selectedState,
        language: state.language,
        isOnboarded: state.isOnboarded,
        emergencyContacts: state.emergencyContacts,
      }),
    }
  )
);

// Selectors for better performance
export const useUser = () => useAppStore((state) => state.user);
export const useLocation = () => useAppStore((state) => state.location);
export const useRecording = () => useAppStore((state) => state.recording);
export const useSelectedState = () => useAppStore((state) => state.selectedState);
export const useLanguage = () => useAppStore((state) => state.language);
export const useIsOnboarded = () => useAppStore((state) => state.isOnboarded);
export const useEmergencyContacts = () => useAppStore((state) => state.emergencyContacts);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);
