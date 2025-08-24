/**
 * Booking Events Service
 * Handles events related to booking operations
 */

/**
 * Event types
 */
export const EVENT_TYPES = {
  APPOINTMENT_CREATED: 'appointment.created',
  APPOINTMENT_UPDATED: 'appointment.updated',
  APPOINTMENT_CANCELLED: 'appointment.cancelled',
  APPOINTMENT_REMINDER: 'appointment.reminder',
  REBOOKING_SUGGESTED: 'rebooking.suggested',
  REBOOKING_CONFIRMED: 'rebooking.confirmed',
  REBOOKING_DECLINED: 'rebooking.declined'
};

/**
 * Event listeners
 */
const listeners = {
  [EVENT_TYPES.APPOINTMENT_CREATED]: [],
  [EVENT_TYPES.APPOINTMENT_UPDATED]: [],
  [EVENT_TYPES.APPOINTMENT_CANCELLED]: [],
  [EVENT_TYPES.APPOINTMENT_REMINDER]: [],
  [EVENT_TYPES.REBOOKING_SUGGESTED]: [],
  [EVENT_TYPES.REBOOKING_CONFIRMED]: [],
  [EVENT_TYPES.REBOOKING_DECLINED]: []
};

/**
 * Register an event listener
 * @param {string} eventType - Event type
 * @param {Function} listener - Event listener function
 * @returns {Function} Function to remove the listener
 */
export function addEventListener(eventType, listener) {
  if (!listeners[eventType]) {
    listeners[eventType] = [];
  }
  
  listeners[eventType].push(listener);
  
  // Return function to remove the listener
  return () => {
    removeEventListener(eventType, listener);
  };
}

/**
 * Remove an event listener
 * @param {string} eventType - Event type
 * @param {Function} listener - Event listener function
 */
export function removeEventListener(eventType, listener) {
  if (!listeners[eventType]) {
    return;
  }
  
  const index = listeners[eventType].indexOf(listener);
  
  if (index !== -1) {
    listeners[eventType].splice(index, 1);
  }
}

/**
 * Dispatch an event
 * @param {string} eventType - Event type
 * @param {Object} eventData - Event data
 */
export function dispatchEvent(eventType, eventData) {
  if (!listeners[eventType]) {
    return;
  }
  
  const event = {
    type: eventType,
    data: eventData,
    timestamp: new Date().toISOString()
  };
  
  // Call all listeners for this event type
  listeners[eventType].forEach(listener => {
    try {
      listener(event);
    } catch (error) {
      console.error(`Error in event listener for ${eventType}:`, error);
    }
  });
}

/**
 * Handle appointment created event
 * @param {Object} appointment - Appointment data
 */
export function handleAppointmentCreated(appointment) {
  dispatchEvent(EVENT_TYPES.APPOINTMENT_CREATED, { appointment });
  
  // Schedule a reminder for this appointment
  scheduleAppointmentReminder(appointment);
}

/**
 * Handle appointment updated event
 * @param {Object} appointment - Updated appointment data
 * @param {Object} previousAppointment - Previous appointment data
 */
export function handleAppointmentUpdated(appointment, previousAppointment) {
  dispatchEvent(EVENT_TYPES.APPOINTMENT_UPDATED, { 
    appointment, 
    previousAppointment 
  });
  
  // Reschedule the reminder
  scheduleAppointmentReminder(appointment);
}

/**
 * Handle appointment cancelled event
 * @param {Object} appointment - Cancelled appointment data
 */
export function handleAppointmentCancelled(appointment) {
  dispatchEvent(EVENT_TYPES.APPOINTMENT_CANCELLED, { appointment });
  
  // Cancel any scheduled reminders
  cancelAppointmentReminder(appointment.id);
}

/**
 * Schedule an appointment reminder
 * @param {Object} appointment - Appointment data
 */
function scheduleAppointmentReminder(appointment) {
  // In a real implementation, this would schedule a reminder
  // using a job queue or similar mechanism
  
  console.log(`Scheduled reminder for appointment ${appointment.id}`);
  
  // Mock implementation - in a real app, this would be handled by a job scheduler
  const appointmentDate = new Date(appointment.startTime);
  const now = new Date();
  
  // Calculate time until 24 hours before the appointment
  const reminderTime = new Date(appointmentDate);
  reminderTime.setHours(reminderTime.getHours() - 24);
  
  const timeUntilReminder = reminderTime.getTime() - now.getTime();
  
  // Only schedule if the reminder time is in the future
  if (timeUntilReminder > 0) {
    setTimeout(() => {
      dispatchEvent(EVENT_TYPES.APPOINTMENT_REMINDER, { appointment });
    }, timeUntilReminder);
  }
}

/**
 * Cancel a scheduled appointment reminder
 * @param {string} appointmentId - Appointment ID
 */
function cancelAppointmentReminder(appointmentId) {
  // In a real implementation, this would cancel a scheduled reminder
  // using a job queue or similar mechanism
  
  console.log(`Cancelled reminder for appointment ${appointmentId}`);
}

/**
 * Handle rebooking suggested event
 * @param {Object} suggestion - Rebooking suggestion
 * @param {string} customerId - Customer ID
 */
export function handleRebookingSuggested(suggestion, customerId) {
  dispatchEvent(EVENT_TYPES.REBOOKING_SUGGESTED, { 
    suggestion, 
    customerId 
  });
}

/**
 * Handle rebooking confirmed event
 * @param {Object} booking - New booking data
 * @param {Object} suggestion - Original suggestion
 */
export function handleRebookingConfirmed(booking, suggestion) {
  dispatchEvent(EVENT_TYPES.REBOOKING_CONFIRMED, { 
    booking, 
    suggestion 
  });
  
  // Also trigger appointment created event
  handleAppointmentCreated(booking);
}

/**
 * Handle rebooking declined event
 * @param {Object} suggestion - Declined suggestion
 * @param {string} customerId - Customer ID
 * @param {string} reason - Reason for declining (optional)
 */
export function handleRebookingDeclined(suggestion, customerId, reason) {
  dispatchEvent(EVENT_TYPES.REBOOKING_DECLINED, { 
    suggestion, 
    customerId,
    reason
  });
}

export default {
  EVENT_TYPES,
  addEventListener,
  removeEventListener,
  dispatchEvent,
  handleAppointmentCreated,
  handleAppointmentUpdated,
  handleAppointmentCancelled,
  handleRebookingSuggested,
  handleRebookingConfirmed,
  handleRebookingDeclined
};

