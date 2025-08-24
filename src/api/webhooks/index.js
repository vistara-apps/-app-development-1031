/**
 * Webhook handler for booking platforms
 * This module handles incoming webhook events from various booking platforms
 */

/**
 * Process a webhook event
 * @param {Object} event - Webhook event data
 * @param {string} platform - Platform name
 * @returns {Promise<Object>} Processing result
 */
export async function processWebhookEvent(event, platform) {
  try {
    // Validate the webhook event
    validateWebhookEvent(event, platform);
    
    // Determine event type and route to appropriate handler
    const eventType = getEventType(event, platform);
    const handler = getEventHandler(eventType, platform);
    
    // Process the event
    const result = await handler(event);
    
    return {
      success: true,
      eventType,
      result
    };
  } catch (error) {
    console.error(`Error processing ${platform} webhook:`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Validate a webhook event
 * @param {Object} event - Webhook event data
 * @param {string} platform - Platform name
 * @throws {Error} If validation fails
 */
function validateWebhookEvent(event, platform) {
  if (!event) {
    throw new Error('No event data provided');
  }
  
  // Platform-specific validation
  switch (platform.toLowerCase()) {
    case 'vagaro':
      if (!event.eventId || !event.eventType) {
        throw new Error('Invalid Vagaro webhook event format');
      }
      break;
    case 'mindbody':
      if (!event.EventType || !event.EventTime) {
        throw new Error('Invalid Mindbody webhook event format');
      }
      break;
    case 'phorest':
      if (!event.type || !event.data) {
        throw new Error('Invalid Phorest webhook event format');
      }
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

/**
 * Get the event type from a webhook event
 * @param {Object} event - Webhook event data
 * @param {string} platform - Platform name
 * @returns {string} Event type
 */
function getEventType(event, platform) {
  switch (platform.toLowerCase()) {
    case 'vagaro':
      return event.eventType;
    case 'mindbody':
      return event.EventType;
    case 'phorest':
      return event.type;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

/**
 * Get the appropriate event handler for an event type
 * @param {string} eventType - Event type
 * @param {string} platform - Platform name
 * @returns {Function} Event handler function
 */
function getEventHandler(eventType, platform) {
  // Normalize event types across platforms
  const normalizedType = normalizeEventType(eventType, platform);
  
  // Get handler based on normalized event type
  switch (normalizedType) {
    case 'appointment.created':
      return handleAppointmentCreated;
    case 'appointment.updated':
      return handleAppointmentUpdated;
    case 'appointment.cancelled':
      return handleAppointmentCancelled;
    case 'customer.created':
      return handleCustomerCreated;
    case 'customer.updated':
      return handleCustomerUpdated;
    default:
      // Default handler for unsupported event types
      return async (event) => ({
        message: `Unhandled event type: ${normalizedType}`,
        event
      });
  }
}

/**
 * Normalize event types across platforms
 * @param {string} eventType - Platform-specific event type
 * @param {string} platform - Platform name
 * @returns {string} Normalized event type
 */
function normalizeEventType(eventType, platform) {
  switch (platform.toLowerCase()) {
    case 'vagaro':
      switch (eventType) {
        case 'appointment_created':
          return 'appointment.created';
        case 'appointment_updated':
          return 'appointment.updated';
        case 'appointment_cancelled':
          return 'appointment.cancelled';
        case 'customer_created':
          return 'customer.created';
        case 'customer_updated':
          return 'customer.updated';
        default:
          return eventType;
      }
    case 'mindbody':
      switch (eventType) {
        case 'AppointmentCreated':
          return 'appointment.created';
        case 'AppointmentUpdated':
          return 'appointment.updated';
        case 'AppointmentCancelled':
          return 'appointment.cancelled';
        case 'ClientCreated':
          return 'customer.created';
        case 'ClientUpdated':
          return 'customer.updated';
        default:
          return eventType;
      }
    case 'phorest':
      switch (eventType) {
        case 'appointment.create':
          return 'appointment.created';
        case 'appointment.update':
          return 'appointment.updated';
        case 'appointment.delete':
          return 'appointment.cancelled';
        case 'client.create':
          return 'customer.created';
        case 'client.update':
          return 'customer.updated';
        default:
          return eventType;
      }
    default:
      return eventType;
  }
}

/**
 * Handle appointment created event
 * @param {Object} event - Webhook event data
 * @returns {Promise<Object>} Processing result
 */
async function handleAppointmentCreated(event) {
  // In a real implementation, this would:
  // 1. Extract appointment details from the event
  // 2. Create or update the appointment in our system
  // 3. Trigger any necessary notifications
  
  console.log('Appointment created:', event);
  
  return {
    message: 'Appointment created successfully',
    appointmentId: event.appointmentId || event.data?.id || event.Id
  };
}

/**
 * Handle appointment updated event
 * @param {Object} event - Webhook event data
 * @returns {Promise<Object>} Processing result
 */
async function handleAppointmentUpdated(event) {
  // In a real implementation, this would:
  // 1. Extract appointment details from the event
  // 2. Update the appointment in our system
  // 3. Trigger any necessary notifications
  
  console.log('Appointment updated:', event);
  
  return {
    message: 'Appointment updated successfully',
    appointmentId: event.appointmentId || event.data?.id || event.Id
  };
}

/**
 * Handle appointment cancelled event
 * @param {Object} event - Webhook event data
 * @returns {Promise<Object>} Processing result
 */
async function handleAppointmentCancelled(event) {
  // In a real implementation, this would:
  // 1. Extract appointment details from the event
  // 2. Cancel the appointment in our system
  // 3. Trigger any necessary notifications
  
  console.log('Appointment cancelled:', event);
  
  return {
    message: 'Appointment cancelled successfully',
    appointmentId: event.appointmentId || event.data?.id || event.Id
  };
}

/**
 * Handle customer created event
 * @param {Object} event - Webhook event data
 * @returns {Promise<Object>} Processing result
 */
async function handleCustomerCreated(event) {
  // In a real implementation, this would:
  // 1. Extract customer details from the event
  // 2. Create the customer in our system
  
  console.log('Customer created:', event);
  
  return {
    message: 'Customer created successfully',
    customerId: event.customerId || event.data?.id || event.Id
  };
}

/**
 * Handle customer updated event
 * @param {Object} event - Webhook event data
 * @returns {Promise<Object>} Processing result
 */
async function handleCustomerUpdated(event) {
  // In a real implementation, this would:
  // 1. Extract customer details from the event
  // 2. Update the customer in our system
  
  console.log('Customer updated:', event);
  
  return {
    message: 'Customer updated successfully',
    customerId: event.customerId || event.data?.id || event.Id
  };
}

export default {
  processWebhookEvent
};

