import axios from 'axios';
import { Photo, Challenge, User, Gift } from '@/types';

const API_BASE_URL = '/api';

// Photo API functions
export const uploadPhoto = async (file: File, userId: string): Promise<Photo> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);
  
  const response = await axios.post(`${API_BASE_URL}/photos/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const enhancePhoto = async (photoId: string, filterId: string, isPremium: boolean): Promise<Photo> => {
  const response = await axios.post(`${API_BASE_URL}/photos/enhance`, {
    photoId,
    filterId,
    isPremium,
  });
  
  return response.data;
};

export const getPhotosByUser = async (userId: string): Promise<Photo[]> => {
  const response = await axios.get(`${API_BASE_URL}/photos/user/${userId}`);
  return response.data;
};

// Challenge API functions
export const getActiveChallenges = async (): Promise<Challenge[]> => {
  const response = await axios.get(`${API_BASE_URL}/challenges/active`);
  return response.data;
};

export const getChallengeById = async (challengeId: string): Promise<Challenge> => {
  const response = await axios.get(`${API_BASE_URL}/challenges/${challengeId}`);
  return response.data;
};

export const submitPhotoToChallenge = async (photoId: string, challengeId: string, userId: string): Promise<void> => {
  await axios.post(`${API_BASE_URL}/challenges/submit`, {
    photoId,
    challengeId,
    userId,
  });
};

export const getChallengeSubmissions = async (challengeId: string): Promise<Photo[]> => {
  const response = await axios.get(`${API_BASE_URL}/challenges/${challengeId}/submissions`);
  return response.data;
};

// Gift API functions
export const sendGift = async (senderUserId: string, photoId: string, treatType: string): Promise<Gift> => {
  const response = await axios.post(`${API_BASE_URL}/gifts/send`, {
    senderUserId,
    photoId,
    treatType,
  });
  
  return response.data;
};

export const getGiftsByPhoto = async (photoId: string): Promise<Gift[]> => {
  const response = await axios.get(`${API_BASE_URL}/gifts/photo/${photoId}`);
  return response.data;
};

// User API functions
export const getUserProfile = async (farcasterId: string): Promise<User> => {
  const response = await axios.get(`${API_BASE_URL}/users/${farcasterId}`);
  return response.data;
};

// Farcaster API functions
export const verifyFarcasterUser = async (message: string, signature: string): Promise<User> => {
  const response = await axios.post(`${API_BASE_URL}/auth/verify`, {
    message,
    signature,
  });
  
  return response.data;
};

