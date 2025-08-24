/**
 * Base error class for booking integration errors
 */
export class BookingIntegrationError extends Error {
  constructor(message, code = 'BOOKING_ERROR', originalError = null) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.originalError = originalError;
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends BookingIntegrationError {
  constructor(message, originalError = null) {
    super(message, 'AUTHENTICATION_ERROR', originalError);
  }
}

/**
 * Connection error
 */
export class ConnectionError extends BookingIntegrationError {
  constructor(message, originalError = null) {
    super(message, 'CONNECTION_ERROR', originalError);
  }
}

/**
 * Resource not found error
 */
export class NotFoundError extends BookingIntegrationError {
  constructor(message, originalError = null) {
    super(message, 'NOT_FOUND_ERROR', originalError);
  }
}

/**
 * Validation error
 */
export class ValidationError extends BookingIntegrationError {
  constructor(message, originalError = null) {
    super(message, 'VALIDATION_ERROR', originalError);
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends BookingIntegrationError {
  constructor(message, originalError = null) {
    super(message, 'RATE_LIMIT_ERROR', originalError);
  }
}

/**
 * Permission error
 */
export class PermissionError extends BookingIntegrationError {
  constructor(message, originalError = null) {
    super(message, 'PERMISSION_ERROR', originalError);
  }
}

/**
 * Booking conflict error
 */
export class BookingConflictError extends BookingIntegrationError {
  constructor(message, originalError = null) {
    super(message, 'BOOKING_CONFLICT_ERROR', originalError);
  }
}

/**
 * Unavailable time slot error
 */
export class UnavailableTimeSlotError extends BookingIntegrationError {
  constructor(message, originalError = null) {
    super(message, 'UNAVAILABLE_TIME_SLOT_ERROR', originalError);
  }
}

/**
 * Convert platform-specific errors to standardized booking integration errors
 * @param {Error} error - Original error
 * @param {string} platform - Platform name
 * @returns {BookingIntegrationError} Standardized error
 */
export function normalizeError(error, platform) {
  // If it's already a BookingIntegrationError, return it
  if (error instanceof BookingIntegrationError) {
    return error;
  }
  
  // Default error message
  let message = `${platform} integration error: ${error.message || 'Unknown error'}`;
  
  // Check for common HTTP status codes
  if (error.response) {
    const status = error.response.status;
    
    switch (status) {
      case 401:
      case 403:
        return new AuthenticationError(message, error);
      case 404:
        return new NotFoundError(message, error);
      case 422:
        return new ValidationError(message, error);
      case 429:
        return new RateLimitError(message, error);
      case 409:
        return new BookingConflictError(message, error);
    }
  }
  
  // Check for network errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return new ConnectionError(message, error);
  }
  
  // Default to generic booking error
  return new BookingIntegrationError(message, 'UNKNOWN_ERROR', error);
}

