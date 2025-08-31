import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// Create a new user profile
export const createUserProfile = async (userId, userData) => {
  try {
    const userProfileRef = doc(db, 'userProfiles', userId);
    
    await setDoc(userProfileRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      onboardingCompleted: false,
      onboardingStep: 0
    });
    
    return await getUserProfile(userId);
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userProfileRef = doc(db, 'userProfiles', userId);
    const userProfileSnap = await getDoc(userProfileRef);
    
    if (userProfileSnap.exists()) {
      return {
        id: userProfileSnap.id,
        ...userProfileSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Update user profile
export const saveUserProfile = async (userId, userData) => {
  try {
    const userProfileRef = doc(db, 'userProfiles', userId);
    const userProfileSnap = await getDoc(userProfileRef);
    
    if (userProfileSnap.exists()) {
      // Update existing profile
      await updateDoc(userProfileRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new profile
      await setDoc(userProfileRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    return await getUserProfile(userId);
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

// Update user profile photo
export const updateProfilePhoto = async (userId, photoURL) => {
  try {
    const userProfileRef = doc(db, 'userProfiles', userId);
    
    await updateDoc(userProfileRef, {
      photoURL,
      updatedAt: serverTimestamp()
    });
    
    return await getUserProfile(userId);
  } catch (error) {
    console.error("Error updating profile photo:", error);
    throw error;
  }
};

