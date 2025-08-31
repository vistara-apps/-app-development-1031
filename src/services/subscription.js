import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium'
};

// Create default subscription
export const createDefaultSubscription = async (userId) => {
  try {
    const subscriptionRef = doc(db, 'subscriptions', userId);
    
    await setDoc(subscriptionRef, {
      userId,
      tier: SUBSCRIPTION_TIERS.FREE,
      features: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return await getUserSubscription(userId);
  } catch (error) {
    console.error("Error creating default subscription:", error);
    throw error;
  }
};

// Get user subscription
export const getUserSubscription = async (userId) => {
  try {
    const subscriptionRef = doc(db, 'subscriptions', userId);
    const subscriptionSnap = await getDoc(subscriptionRef);
    
    if (subscriptionSnap.exists()) {
      return {
        id: subscriptionSnap.id,
        ...subscriptionSnap.data()
      };
    }
    
    // If no subscription exists, create a default one
    return await createDefaultSubscription(userId);
  } catch (error) {
    console.error("Error getting user subscription:", error);
    throw error;
  }
};

// Update user subscription
export const updateUserSubscription = async (userId, tier, metadata = {}) => {
  try {
    const subscriptionRef = doc(db, 'subscriptions', userId);
    const subscriptionSnap = await getDoc(subscriptionRef);
    
    if (subscriptionSnap.exists()) {
      // Update existing subscription
      await updateDoc(subscriptionRef, {
        tier,
        ...metadata,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new subscription
      await setDoc(subscriptionRef, {
        userId,
        tier,
        ...metadata,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    return await getUserSubscription(userId);
  } catch (error) {
    console.error("Error updating user subscription:", error);
    throw error;
  }
};

