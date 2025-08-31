import { 
  doc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { generateFastingPlan } from './openai';
import { getUserProfile } from './user';

// Create a new fasting plan
export const createFastingPlan = async (userId, userData) => {
  try {
    // Generate plan using OpenAI
    const plan = await generateFastingPlan(userData);
    
    // Save plan to Firestore
    const planRef = doc(db, 'fastingPlans', userId);
    
    await updateDoc(planRef, {
      ...plan,
      userId,
      updatedAt: serverTimestamp()
    }).catch(async (error) => {
      // If document doesn't exist, create it
      if (error.code === 'not-found') {
        await setDoc(planRef, {
          ...plan,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        throw error;
      }
    });
    
    return {
      id: userId,
      ...plan,
      updatedAt: new Date()
    };
  } catch (error) {
    console.error("Error creating fasting plan:", error);
    throw error;
  }
};

// Get current fasting plan
export const getCurrentFastingPlan = async (userId) => {
  try {
    const planRef = doc(db, 'fastingPlans', userId);
    const planSnap = await getDoc(planRef);
    
    if (planSnap.exists()) {
      return {
        id: planSnap.id,
        ...planSnap.data()
      };
    }
    
    // If no plan exists, create a default plan
    const userProfile = await getUserProfile(userId);
    
    if (userProfile && userProfile.onboardingCompleted) {
      return await createFastingPlan(userId, userProfile);
    }
    
    return null;
  } catch (error) {
    console.error("Error getting fasting plan:", error);
    throw error;
  }
};

// Update fasting plan
export const updateFastingPlan = async (userId, planData) => {
  try {
    const planRef = doc(db, 'fastingPlans', userId);
    
    await updateDoc(planRef, {
      ...planData,
      updatedAt: serverTimestamp()
    });
    
    return await getCurrentFastingPlan(userId);
  } catch (error) {
    console.error("Error updating fasting plan:", error);
    throw error;
  }
};

// Start a fasting session
export const startFastingSession = async (userId) => {
  try {
    // End any active sessions first
    await endActiveSessions(userId);
    
    // Create new session
    const sessionRef = collection(db, 'fastingSessions');
    const newSession = await addDoc(sessionRef, {
      userId,
      startTime: serverTimestamp(),
      active: true,
      createdAt: serverTimestamp()
    });
    
    return newSession.id;
  } catch (error) {
    console.error("Error starting fasting session:", error);
    throw error;
  }
};

// End active fasting sessions
export const endActiveSessions = async (userId) => {
  try {
    const sessionsRef = collection(db, 'fastingSessions');
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      where('active', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    const updatePromises = [];
    querySnapshot.forEach((doc) => {
      updatePromises.push(
        updateDoc(doc.ref, {
          active: false,
          endTime: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      );
    });
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error ending active sessions:", error);
    throw error;
  }
};

// End a specific fasting session
export const endFastingSession = async (userId, sessionId = null) => {
  try {
    if (sessionId) {
      // End specific session
      const sessionRef = doc(db, 'fastingSessions', sessionId);
      const sessionSnap = await getDoc(sessionRef);
      
      if (sessionSnap.exists() && sessionSnap.data().userId === userId) {
        await updateDoc(sessionRef, {
          active: false,
          endTime: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } else {
      // End all active sessions
      await endActiveSessions(userId);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error ending fasting session:", error);
    throw error;
  }
};

// Get active fasting session
export const getActiveSession = async (userId) => {
  try {
    const sessionsRef = collection(db, 'fastingSessions');
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      where('active', '==', true),
      orderBy('startTime', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting active session:", error);
    throw error;
  }
};

// Get fasting history
export const getFastingHistory = async (userId, days = 7) => {
  try {
    const sessionsRef = collection(db, 'fastingSessions');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      where('startTime', '>=', startDate),
      orderBy('startTime', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const sessions = [];
    querySnapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return sessions;
  } catch (error) {
    console.error("Error getting fasting history:", error);
    throw error;
  }
};

// Calculate fasting status
export const calculateFastingStatus = (session) => {
  if (!session || !session.startTime) {
    return { active: false, elapsed: 0, elapsedHours: 0, elapsedMinutes: 0, statusText: 'Not fasting' };
  }
  
  const startTime = session.startTime.toDate ? session.startTime.toDate() : new Date(session.startTime);
  const now = new Date();
  const elapsed = now - startTime;
  const elapsedHours = Math.floor(elapsed / (1000 * 60 * 60));
  const elapsedMinutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
  
  let statusText = 'Fasting in progress';
  
  if (elapsedHours < 12) {
    statusText = 'Early fasting phase';
  } else if (elapsedHours < 16) {
    statusText = 'Fat burning phase';
  } else if (elapsedHours < 24) {
    statusText = 'Deep fat burning phase';
  } else if (elapsedHours < 48) {
    statusText = 'Autophagy phase';
  } else {
    statusText = 'Extended fasting phase';
  }
  
  return {
    active: session.active,
    elapsed,
    elapsedHours,
    elapsedMinutes,
    statusText
  };
};

// Get weekly fasting stats
export const getWeeklyFastingStats = async (userId) => {
  try {
    // Get sessions from the last 7 days
    const sessions = await getFastingHistory(userId, 7);
    
    // Calculate stats
    let totalHours = 0;
    let completedSessions = 0;
    
    sessions.forEach((session) => {
      if (session.startTime && (session.endTime || !session.active)) {
        const startTime = session.startTime.toDate ? session.startTime.toDate() : new Date(session.startTime);
        const endTime = session.endTime ? 
          (session.endTime.toDate ? session.endTime.toDate() : new Date(session.endTime)) : 
          new Date();
        
        const durationHours = (endTime - startTime) / (1000 * 60 * 60);
        
        // Only count completed sessions (at least 12 hours)
        if (durationHours >= 12) {
          totalHours += durationHours;
          completedSessions++;
        }
      }
    });
    
    // Calculate average duration
    const averageDuration = completedSessions > 0 ? totalHours / completedSessions : 0;
    
    // Calculate fasting score (0-100)
    // Based on number of sessions, total hours, and average duration
    const targetSessions = 7; // Ideal: one session per day
    const targetHours = 16 * 7; // Ideal: 16 hours per day
    const targetAverage = 16; // Ideal: 16 hours per session
    
    const sessionScore = Math.min(100, (completedSessions / targetSessions) * 100);
    const hoursScore = Math.min(100, (totalHours / targetHours) * 100);
    const averageScore = Math.min(100, (averageDuration / targetAverage) * 100);
    
    // Weighted score
    const fastingScore = Math.round((sessionScore * 0.4) + (hoursScore * 0.4) + (averageScore * 0.2));
    
    return {
      totalSessions: 7, // Target: one session per day
      completedSessions,
      totalHours,
      averageDuration,
      fastingScore
    };
  } catch (error) {
    console.error("Error getting weekly stats:", error);
    throw error;
  }
};

