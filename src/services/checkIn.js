import { 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { getUserProfile } from './user';
import { getCurrentFastingPlan, updateFastingPlan } from './fastingPlan';
import { adjustFastingPlan } from './openai';

// Submit daily check-in
export const submitDailyCheckIn = async (userId, checkInData) => {
  try {
    // Check if user has already checked in today
    const existingCheckIn = await getTodayCheckIn(userId);
    
    if (existingCheckIn) {
      // Update existing check-in
      const checkInRef = doc(db, 'checkIns', existingCheckIn.id);
      
      await updateDoc(checkInRef, {
        ...checkInData,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new check-in
      const checkInRef = collection(db, 'checkIns');
      
      await addDoc(checkInRef, {
        userId,
        ...checkInData,
        date: new Date().toISOString().split('T')[0], // Store date as YYYY-MM-DD
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    // Get user profile and current fasting plan
    const userProfile = await getUserProfile(userId);
    const currentPlan = await getCurrentFastingPlan(userId);
    
    // Adjust fasting plan based on check-in data
    const adjustedPlan = await adjustFastingPlan(userProfile, currentPlan, checkInData);
    
    // Update fasting plan in Firestore
    await updateFastingPlan(userId, adjustedPlan);
    
    return {
      success: true,
      adjustedPlan
    };
  } catch (error) {
    console.error("Error submitting check-in:", error);
    throw error;
  }
};

// Get today's check-in
export const getTodayCheckIn = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const checkInsRef = collection(db, 'checkIns');
    const q = query(
      checkInsRef,
      where('userId', '==', userId),
      where('date', '==', today)
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
    console.error("Error getting today's check-in:", error);
    throw error;
  }
};

// Get check-in history
export const getCheckInHistory = async (userId, days = 7) => {
  try {
    const checkInsRef = collection(db, 'checkIns');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
    
    const q = query(
      checkInsRef,
      where('userId', '==', userId),
      where('date', '>=', startDateStr),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    const checkIns = [];
    querySnapshot.forEach((doc) => {
      checkIns.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return checkIns;
  } catch (error) {
    console.error("Error getting check-in history:", error);
    throw error;
  }
};

// Get mood trend data
export const getMoodTrend = async (userId, days = 7) => {
  try {
    const checkIns = await getCheckInHistory(userId, days);
    
    // Format data for chart
    const labels = [];
    const moodData = [];
    const energyData = [];
    
    // Create array of dates for the last 'days' days
    const dateArray = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dateArray.unshift(date.toISOString().split('T')[0]); // YYYY-MM-DD
    }
    
    // Map check-ins to dates
    dateArray.forEach(date => {
      labels.push(date);
      
      const checkIn = checkIns.find(c => c.date === date);
      
      if (checkIn) {
        moodData.push(checkIn.mood);
        energyData.push(checkIn.energyLevel);
      } else {
        moodData.push(null);
        energyData.push(null);
      }
    });
    
    return {
      labels,
      moodData,
      energyData
    };
  } catch (error) {
    console.error("Error getting mood trend:", error);
    throw error;
  }
};

