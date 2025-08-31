import { format, subDays } from 'date-fns';
import { calculateHours } from './timeUtils';

// Generate daily fasting data for chart
export const generateDailyFastingData = (sessions, days = 7) => {
  if (!sessions || sessions.length === 0) {
    return { labels: [], datasets: [] };
  }
  
  // Create array of dates for the last 'days' days
  const dateArray = [];
  const labels = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    dateArray.push(dateStr);
    labels.push(format(date, 'MMM d'));
  }
  
  // Calculate fasting hours for each day
  const fastingHours = dateArray.map(dateStr => {
    // Find sessions that ended on this date
    const daySessions = sessions.filter(session => {
      if (!session.endTime) return false;
      
      const endTime = session.endTime.toDate ? session.endTime.toDate() : new Date(session.endTime);
      const endDateStr = format(endTime, 'yyyy-MM-dd');
      
      return endDateStr === dateStr;
    });
    
    // Calculate total fasting hours for the day
    let totalHours = 0;
    
    daySessions.forEach(session => {
      const startTime = session.startTime.toDate ? session.startTime.toDate() : new Date(session.startTime);
      const endTime = session.endTime.toDate ? session.endTime.toDate() : new Date(session.endTime);
      
      totalHours += calculateHours(startTime, endTime);
    });
    
    return Math.round(totalHours * 10) / 10; // Round to 1 decimal place
  });
  
  // Add active session if any
  const activeSession = sessions.find(session => session.active);
  
  if (activeSession) {
    const startTime = activeSession.startTime.toDate ? activeSession.startTime.toDate() : new Date(activeSession.startTime);
    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');
    const todayIndex = dateArray.indexOf(todayStr);
    
    if (todayIndex !== -1) {
      const hours = calculateHours(startTime, now);
      fastingHours[todayIndex] = Math.round((fastingHours[todayIndex] + hours) * 10) / 10;
    }
  }
  
  return {
    labels,
    datasets: [
      {
        label: 'Fasting Hours',
        data: fastingHours,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };
};

// Generate mood trend data for chart
export const generateMoodTrendData = (checkIns, days = 7) => {
  if (!checkIns || checkIns.length === 0) {
    return { labels: [], datasets: [] };
  }
  
  // Create array of dates for the last 'days' days
  const dateArray = [];
  const labels = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    dateArray.push(dateStr);
    labels.push(format(date, 'MMM d'));
  }
  
  // Extract mood and energy data
  const moodData = dateArray.map(dateStr => {
    const checkIn = checkIns.find(c => c.date === dateStr);
    return checkIn ? checkIn.mood : null;
  });
  
  const energyData = dateArray.map(dateStr => {
    const checkIn = checkIns.find(c => c.date === dateStr);
    return checkIn ? checkIn.energyLevel : null;
  });
  
  return {
    labels,
    datasets: [
      {
        label: 'Mood',
        data: moodData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Energy',
        data: energyData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };
};

