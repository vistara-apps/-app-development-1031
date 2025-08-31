import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../services/user';
import { getUserSubscription } from '../services/subscription';
import { getCurrentFastingPlan } from '../services/fastingPlan';
import { getActiveSession } from '../services/timer';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [fastingPlan, setFastingPlan] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Fetch user profile
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          
          // Fetch subscription status
          const subscriptionData = await getUserSubscription(user.uid);
          setSubscription(subscriptionData);
          
          // Fetch current fasting plan
          const plan = await getCurrentFastingPlan(user.uid);
          setFastingPlan(plan);
          
          // Fetch active fasting session
          const session = await getActiveSession(user.uid);
          setActiveSession(session);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // Reset user-related state when logged out
        setUserProfile(null);
        setSubscription(null);
        setFastingPlan(null);
        setActiveSession(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Update user profile in context
  const updateUserProfile = (profile) => {
    setUserProfile(profile);
  };

  // Update subscription in context
  const updateSubscription = (subscriptionData) => {
    setSubscription(subscriptionData);
  };

  // Update fasting plan in context
  const updateFastingPlan = (plan) => {
    setFastingPlan(plan);
  };

  // Update active session in context
  const updateActiveSession = (session) => {
    setActiveSession(session);
  };

  // Context value
  const value = {
    currentUser,
    userProfile,
    subscription,
    fastingPlan,
    activeSession,
    updateUserProfile,
    updateSubscription,
    updateFastingPlan,
    updateActiveSession
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

