import { doc, setDoc, getDoc, updateDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Start a new fasting session
 * @param {string} userId - User ID
 * @returns {Promise<string>} - Session ID
 */
export const startFastingSession = async (userId) => {
  try {
    // Check if there's an active session
    const activeSession = await getActiveSession(userId);
    
    if (activeSession) {
      throw new Error("There is already an active fasting session");
    }
    
    // Create a new session
    const sessionRef = await addDoc(collection(db, "users", userId, "fastingSessions"), {
      startTime: Timestamp.now(),
      active: true,
      createdAt: Timestamp.now()
    });
    
    // Update user's active session reference
    await setDoc(doc(db, "users", userId, "activeSession", "current"), {
      sessionId: sessionRef.id,
      startTime: Timestamp.now()
    });
    
    return sessionRef.id;
  } catch (error) {
    console.error("Error starting fasting session:", error);
    throw error;
  }
};

/**
 * End the current fasting session
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Session data
 */
export const endFastingSession = async (userId) => {
  try {
    // Get the active session
    const activeSessionDoc = await getDoc(doc(db, "users", userId, "activeSession", "current"));
    
    if (!activeSessionDoc.exists()) {
      throw new Error("No active fasting session found");
    }
    
    const { sessionId, startTime } = activeSessionDoc.data();
    const endTime = Timestamp.now();
    
    // Calculate duration in milliseconds
    const durationMs = endTime.toMillis() - startTime.toMillis();
    const durationHours = durationMs / (1000 * 60 * 60);
    
    // Update the session document
    const sessionRef = doc(db, "users", userId, "fastingSessions", sessionId);
    await updateDoc(sessionRef, {
      endTime,
      active: false,
      durationMs,
      durationHours
    });
    
    // Delete the active session reference
    await setDoc(doc(db, "users", userId, "activeSession", "current"), {
      active: false,
      lastSessionId: sessionId,
      lastSessionEndTime: endTime
    });
    
    // Get the updated session data
    const updatedSessionDoc = await getDoc(sessionRef);
    
    return {
      id: updatedSessionDoc.id,
      ...updatedSessionDoc.data()
    };
  } catch (error) {
    console.error("Error ending fasting session:", error);
    throw error;
  }
};

/**
 * Get the active fasting session if any
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} - Active session data or null
 */
export const getActiveSession = async (userId) => {
  try {
    const activeSessionDoc = await getDoc(doc(db, "users", userId, "activeSession", "current"));
    
    if (!activeSessionDoc.exists() || !activeSessionDoc.data().active) {
      return null;
    }
    
    const { sessionId } = activeSessionDoc.data();
    const sessionDoc = await getDoc(doc(db, "users", userId, "fastingSessions", sessionId));
    
    if (!sessionDoc.exists()) {
      return null;
    }
    
    return {
      id: sessionDoc.id,
      ...sessionDoc.data()
    };
  } catch (error) {
    console.error("Error getting active session:", error);
    throw error;
  }
};

/**
 * Calculate the current fasting status
 * @param {Object} session - Session data
 * @returns {Object} - Status information
 */
export const calculateFastingStatus = (session) => {
  if (!session || !session.startTime) {
    return {
      active: false,
      elapsed: 0,
      elapsedHours: 0,
      elapsedMinutes: 0,
      statusText: "Not fasting"
    };
  }
  
  const startTime = session.startTime.toDate();
  const now = new Date();
  const elapsedMs = now - startTime;
  const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
  const elapsedMinutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    active: true,
    elapsed: elapsedMs,
    elapsedHours,
    elapsedMinutes,
    statusText: `You're ${elapsedHours}h ${elapsedMinutes}m into your fast`
  };
};

export default {
  startFastingSession,
  endFastingSession,
  getActiveSession,
  calculateFastingStatus
};

