import { addDays, addWeeks, format, parseISO } from 'date-fns';
import rebookingService from './index';

/**
 * Availability Service
 * Handles checking and managing availability across booking platforms
 */
export class AvailabilityService {
  constructor() {
    this.rebookingService = rebookingService;
  }

  /**
   * Find available time slots across multiple criteria
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Array>} Array of available time slots
   */
  async findAvailability(criteria = {}) {
    const integration = this.rebookingService.getBookingIntegration();
    
    // Set default search range if not provided
    const startDate = criteria.startDate || new Date();
    const endDate = criteria.endDate || addWeeks(startDate, 2);
    
    // Build filters from criteria
    const filters = {};
    
    if (criteria.serviceId) {
      filters.serviceId = criteria.serviceId;
    }
    
    if (criteria.providerId) {
      filters.providerId = criteria.providerId;
    }
    
    if (criteria.locationId) {
      filters.locationId = criteria.locationId;
    }
    
    // Get raw availability
    const availability = await integration.getAvailability(startDate, endDate, filters);
    
    // Apply additional filtering
    let filteredAvailability = availability;
    
    // Filter by day of week
    if (criteria.daysOfWeek && criteria.daysOfWeek.length > 0) {
      filteredAvailability = filteredAvailability.filter(slot => {
        const day = new Date(slot.startTime).getDay();
        return criteria.daysOfWeek.includes(day);
      });
    }
    
    // Filter by time of day
    if (criteria.timeOfDay) {
      const { startHour, endHour } = this.getTimeRangeForPreference(criteria.timeOfDay);
      
      filteredAvailability = filteredAvailability.filter(slot => {
        const hour = new Date(slot.startTime).getHours();
        return hour >= startHour && hour < endHour;
      });
    }
    
    // Filter by duration if specified
    if (criteria.minDuration) {
      filteredAvailability = filteredAvailability.filter(slot => 
        slot.getDuration() >= criteria.minDuration
      );
    }
    
    // Sort by criteria
    filteredAvailability = this.sortAvailability(filteredAvailability, criteria.sortBy || 'date');
    
    // Enhance with additional information
    const enhancedAvailability = await this.enhanceAvailability(filteredAvailability);
    
    return enhancedAvailability;
  }

  /**
   * Sort availability based on criteria
   * @param {Array} availability - Array of time slots
   * @param {string} sortBy - Sort criteria (date, provider, duration)
   * @returns {Array} Sorted availability
   */
  sortAvailability(availability, sortBy) {
    const sortedAvailability = [...availability];
    
    switch (sortBy.toLowerCase()) {
      case 'date':
        sortedAvailability.sort((a, b) => 
          new Date(a.startTime) - new Date(b.startTime)
        );
        break;
      case 'provider':
        sortedAvailability.sort((a, b) => 
          a.providerId.localeCompare(b.providerId)
        );
        break;
      case 'duration':
        sortedAvailability.sort((a, b) => 
          a.getDuration() - b.getDuration()
        );
        break;
      default:
        // Default to date sorting
        sortedAvailability.sort((a, b) => 
          new Date(a.startTime) - new Date(b.startTime)
        );
    }
    
    return sortedAvailability;
  }

  /**
   * Enhance availability with additional information
   * @param {Array} availability - Array of time slots
   * @returns {Promise<Array>} Enhanced availability
   */
  async enhanceAvailability(availability) {
    const integration = this.rebookingService.getBookingIntegration();
    
    // Get all services and providers for lookup
    const [services, providers] = await Promise.all([
      integration.getServices(),
      integration.getServiceProviders()
    ]);
    
    // Create lookup maps
    const serviceMap = new Map(services.map(service => [service.id, service]));
    const providerMap = new Map(providers.map(provider => [provider.id, provider]));
    
    // Enhance each time slot
    return availability.map(slot => {
      const service = serviceMap.get(slot.serviceId);
      const provider = providerMap.get(slot.providerId);
      
      return {
        ...slot,
        service,
        provider,
        formattedDateTime: this.formatAppointmentDateTime(slot),
        duration: slot.getDuration(),
        price: service ? service.price : null
      };
    });
  }

  /**
   * Format appointment date and time in a user-friendly way
   * @param {Object} timeSlot - Time slot object
   * @returns {string} Formatted date and time
   */
  formatAppointmentDateTime(timeSlot) {
    const startTime = new Date(timeSlot.startTime);
    return format(startTime, 'EEEE, MMMM d, yyyy \'at\' h:mm a');
  }

  /**
   * Get hour range for a time of day preference
   * @param {string} timeOfDay - Time of day preference (morning, afternoon, evening)
   * @returns {Object} Start and end hours
   */
  getTimeRangeForPreference(timeOfDay) {
    switch (timeOfDay.toLowerCase()) {
      case 'morning':
        return { startHour: 8, endHour: 12 };
      case 'afternoon':
        return { startHour: 12, endHour: 17 };
      case 'evening':
        return { startHour: 17, endHour: 21 };
      default:
        return { startHour: 8, endHour: 21 };
    }
  }

  /**
   * Check if a specific time slot is available
   * @param {Date} dateTime - Date and time to check
   * @param {Object} criteria - Additional criteria
   * @returns {Promise<boolean>} True if the time slot is available
   */
  async isTimeSlotAvailable(dateTime, criteria = {}) {
    const integration = this.rebookingService.getBookingIntegration();
    
    // Set search range to just this day
    const startDate = new Date(dateTime);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);
    
    // Build filters from criteria
    const filters = {};
    
    if (criteria.serviceId) {
      filters.serviceId = criteria.serviceId;
    }
    
    if (criteria.providerId) {
      filters.providerId = criteria.providerId;
    }
    
    // Get availability for the day
    const availability = await integration.getAvailability(startDate, endDate, filters);
    
    // Check if the exact time slot is available
    return availability.some(slot => {
      const slotStart = new Date(slot.startTime);
      return slotStart.getTime() === dateTime.getTime();
    });
  }

  /**
   * Find alternative time slots if a specific time is not available
   * @param {Date} preferredDateTime - Preferred date and time
   * @param {Object} criteria - Additional criteria
   * @returns {Promise<Array>} Array of alternative time slots
   */
  async findAlternativeTimeSlots(preferredDateTime, criteria = {}) {
    // Set search range to a week before and after the preferred date
    const startDate = addDays(preferredDateTime, -7);
    const endDate = addDays(preferredDateTime, 7);
    
    // Find availability in the range
    const availability = await this.findAvailability({
      ...criteria,
      startDate,
      endDate
    });
    
    // Sort by proximity to preferred date and time
    return availability.sort((a, b) => {
      const timeA = new Date(a.startTime);
      const timeB = new Date(b.startTime);
      
      const diffA = Math.abs(timeA - preferredDateTime);
      const diffB = Math.abs(timeB - preferredDateTime);
      
      return diffA - diffB;
    });
  }
}

// Create singleton instance
const availabilityService = new AvailabilityService();
export default availabilityService;

