// User type
export interface User {
  farcasterId: string;
  displayName: string;
  profilePicUrl: string;
}

// Photo type
export interface Photo {
  photoId: string;
  userId: string;
  imageUrl: string;
  enhancedImageUrl?: string;
  tags: string[];
  uploadTimestamp: number;
}

// Challenge type
export interface Challenge {
  challengeId: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  prompt: string;
}

// Gift type
export interface Gift {
  giftId: string;
  senderUserId: string;
  photoId: string;
  treatType: string;
  timestamp: number;
}

// Filter type
export interface Filter {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
  price?: number;
}

// Submission type (Photo submitted to a Challenge)
export interface Submission {
  submissionId: string;
  challengeId: string;
  photoId: string;
  userId: string;
  submissionTimestamp: number;
}

// Treat type
export interface Treat {
  id: string;
  name: string;
  icon: string;
  price: number;
}

