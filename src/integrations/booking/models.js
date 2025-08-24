/**
 * Standardized data models for booking integrations
 * These models provide a consistent interface regardless of the booking platform
 */

/**
 * Represents an appointment/booking
 */
export class Appointment {
  constructor(data = {}) {
    this.id = data.id || null;
    this.customerId = data.customerId || null;
    this.serviceId = data.serviceId || null;
    this.providerId = data.providerId || null;
    this.startTime = data.startTime ? new Date(data.startTime) : null;
    this.endTime = data.endTime ? new Date(data.endTime) : null;
    this.status = data.status || 'pending';
    this.notes = data.notes || '';
    this.price = data.price || null;
    this.platformData = data.platformData || {}; // Platform-specific data
  }

  /**
   * Get appointment duration in minutes
   * @returns {number} Duration in minutes
   */
  getDuration() {
    if (!this.startTime || !this.endTime) {
      return 0;
    }
    return Math.round((this.endTime - this.startTime) / (1000 * 60));
  }

  /**
   * Check if appointment is in the past
   * @returns {boolean} True if appointment is in the past
   */
  isPast() {
    if (!this.endTime) {
      return false;
    }
    return this.endTime < new Date();
  }

  /**
   * Check if appointment is in the future
   * @returns {boolean} True if appointment is in the future
   */
  isFuture() {
    if (!this.startTime) {
      return false;
    }
    return this.startTime > new Date();
  }

  /**
   * Check if appointment is active/in progress
   * @returns {boolean} True if appointment is active
   */
  isActive() {
    const now = new Date();
    return this.startTime <= now && this.endTime >= now;
  }
}

/**
 * Represents a customer
 */
export class Customer {
  constructor(data = {}) {
    this.id = data.id || null;
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.notes = data.notes || '';
    this.platformData = data.platformData || {}; // Platform-specific data
  }

  /**
   * Get customer's full name
   * @returns {string} Full name
   */
  getFullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}

/**
 * Represents a service offered
 */
export class Service {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.duration = data.duration || 0; // Duration in minutes
    this.price = data.price || 0;
    this.category = data.category || '';
    this.platformData = data.platformData || {}; // Platform-specific data
  }
}

/**
 * Represents a service provider (staff member)
 */
export class ServiceProvider {
  constructor(data = {}) {
    this.id = data.id || null;
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.services = data.services || []; // Array of service IDs
    this.platformData = data.platformData || {}; // Platform-specific data
  }

  /**
   * Get provider's full name
   * @returns {string} Full name
   */
  getFullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}

/**
 * Represents an available time slot
 */
export class TimeSlot {
  constructor(data = {}) {
    this.startTime = data.startTime ? new Date(data.startTime) : null;
    this.endTime = data.endTime ? new Date(data.endTime) : null;
    this.providerId = data.providerId || null;
    this.serviceId = data.serviceId || null;
    this.platformData = data.platformData || {}; // Platform-specific data
  }

  /**
   * Get time slot duration in minutes
   * @returns {number} Duration in minutes
   */
  getDuration() {
    if (!this.startTime || !this.endTime) {
      return 0;
    }
    return Math.round((this.endTime - this.startTime) / (1000 * 60));
  }
}

