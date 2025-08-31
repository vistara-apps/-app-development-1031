import { format, formatDistance, formatDuration as formatDurationFn, intervalToDuration } from 'date-fns';

// Format date
export const formatDate = (date, formatString = 'PP') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Format time
export const formatTime = (date, formatString = 'p') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

// Format relative time
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '';
  }
};

// Format duration
export const formatDuration = (milliseconds) => {
  if (!milliseconds) return '0h 0m';
  
  try {
    const duration = intervalToDuration({ start: 0, end: milliseconds });
    
    const days = duration.days ? `${duration.days}d ` : '';
    const hours = duration.hours ? `${duration.hours}h ` : '';
    const minutes = duration.minutes ? `${duration.minutes}m` : '';
    
    return `${days}${hours}${minutes}`.trim() || '0m';
  } catch (error) {
    console.error('Error formatting duration:', error);
    return '0h 0m';
  }
};

// Calculate duration between two dates
export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  try {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    return end - start;
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 0;
  }
};

// Calculate hours between two dates
export const calculateHours = (startDate, endDate) => {
  const duration = calculateDuration(startDate, endDate);
  return duration / (1000 * 60 * 60);
};

