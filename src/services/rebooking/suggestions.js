import { addDays, addWeeks, addMonths, format } from 'date-fns';
import rebookingService from './index';

/**
 * Rebooking Suggestion Service
 * Provides advanced suggestion algorithms for rebooking
 */
export class RebookingSuggestionService {
  constructor() {
    this.rebookingService = rebookingService;
  }

  /**
   * Generate personalized rebooking suggestions for a customer
   * @param {string} customerId - ID of the customer
   * @param {Object} options - Options for generating suggestions
   * @returns {Promise<Array>} Array of personalized rebooking suggestions
   */
  async generatePersonalizedSuggestions(customerId, options = {}) {
    // Get basic suggestions from rebooking service
    const basicSuggestions = await this.rebookingService.generateRebookingSuggestions(customerId, options);
    
    // Enhance suggestions with personalization
    const enhancedSuggestions = await this.enhanceSuggestions(basicSuggestions, customerId);
    
    return enhancedSuggestions;
  }

  /**
   * Enhance suggestions with personalization
   * @param {Array} suggestions - Basic rebooking suggestions
   * @param {string} customerId - ID of the customer
   * @returns {Promise<Array>} Enhanced rebooking suggestions
   */
  async enhanceSuggestions(suggestions, customerId) {
    const integration = this.rebookingService.getBookingIntegration();
    
    // Get customer details
    const customer = await integration.getCustomer(customerId);
    
    // Enhance each suggestion
    const enhancedSuggestions = suggestions.map(suggestion => {
      return {
        ...suggestion,
        personalizedMessage: this.generatePersonalizedMessage(suggestion, customer),
        formattedDateTime: this.formatAppointmentDateTime(suggestion.timeSlot),
        estimatedDuration: suggestion.service.duration,
        estimatedPrice: suggestion.service.price
      };
    });
    
    return enhancedSuggestions;
  }

  /**
   * Generate a personalized message for a rebooking suggestion
   * @param {Object} suggestion - Rebooking suggestion
   * @param {Object} customer - Customer details
   * @returns {string} Personalized message
   */
  generatePersonalizedMessage(suggestion, customer) {
    const serviceName = suggestion.service.name;
    const providerName = suggestion.provider.getFullName();
    const dateTime = this.formatAppointmentDateTime(suggestion.timeSlot);
    
    return `Hi ${customer.firstName}, we'd like to suggest booking your next ${serviceName} with ${providerName} on ${dateTime}. This appointment time is based on your previous booking patterns.`;
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
   * Generate alternative suggestions if the customer rejects initial suggestions
   * @param {string} customerId - ID of the customer
   * @param {Array} rejectedSuggestions - Previously rejected suggestions
   * @param {Object} preferences - Customer preferences for new suggestions
   * @returns {Promise<Array>} Array of alternative rebooking suggestions
   */
  async generateAlternativeSuggestions(customerId, rejectedSuggestions = [], preferences = {}) {
    const integration = this.rebookingService.getBookingIntegration();
    
    // Extract IDs of rejected time slots to avoid suggesting them again
    const rejectedSlotIds = rejectedSuggestions.map(suggestion => 
      suggestion.timeSlot.platformData.id || JSON.stringify(suggestion.timeSlot)
    );
    
    // Determine search parameters based on preferences
    const searchStartDate = preferences.startDate || new Date();
    const searchEndDate = preferences.endDate || addWeeks(searchStartDate, 2);
    
    const filters = {};
    
    if (preferences.serviceId) {
      filters.serviceId = preferences.serviceId;
    } else if (rejectedSuggestions.length > 0) {
      // Use the same service as the rejected suggestions
      filters.serviceId = rejectedSuggestions[0].service.id;
    }
    
    if (preferences.providerId) {
      filters.providerId = preferences.providerId;
    }
    
    // Get availability with filters
    const availability = await integration.getAvailability(searchStartDate, searchEndDate, filters);
    
    // Filter out previously rejected time slots
    const filteredAvailability = availability.filter(slot => {
      const slotId = slot.platformData.id || JSON.stringify(slot);
      return !rejectedSlotIds.includes(slotId);
    });
    
    // Apply time of day preferences if specified
    let timeFilteredAvailability = filteredAvailability;
    if (preferences.timeOfDay) {
      const { startHour, endHour } = this.getTimeRangeForPreference(preferences.timeOfDay);
      
      timeFilteredAvailability = filteredAvailability.filter(slot => {
        const slotHour = new Date(slot.startTime).getHours();
        return slotHour >= startHour && slotHour < endHour;
      });
    }
    
    // Sort by customer preferences
    timeFilteredAvailability.sort((a, b) => {
      // If preferred day of week is specified
      if (preferences.dayOfWeek !== undefined) {
        const dayA = new Date(a.startTime).getDay();
        const dayB = new Date(b.startTime).getDay();
        const dayDiffA = Math.abs(dayA - preferences.dayOfWeek);
        const dayDiffB = Math.abs(dayB - preferences.dayOfWeek);
        
        if (dayDiffA !== dayDiffB) {
          return dayDiffA - dayDiffB;
        }
      }
      
      // Default to sorting by earliest available
      return new Date(a.startTime) - new Date(b.startTime);
    });
    
    // Take top 3 suggestions
    const topSuggestions = timeFilteredAvailability.slice(0, 3);
    
    // Format suggestions with additional details
    const suggestions = [];
    for (const slot of topSuggestions) {
      // Get service details
      const service = await integration.getServices()
        .then(services => services.find(s => s.id === slot.serviceId));
      
      // Get provider details
      const provider = await integration.getServiceProviders()
        .then(providers => providers.find(p => p.id === slot.providerId));
      
      suggestions.push({
        timeSlot: slot,
        service,
        provider,
        customerId
      });
    }
    
    // Enhance suggestions with personalization
    return await this.enhanceSuggestions(suggestions, customerId);
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
}

// Create singleton instance
const rebookingSuggestionService = new RebookingSuggestionService();
export default rebookingSuggestionService;

