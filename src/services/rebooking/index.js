import { addDays, addWeeks, addMonths, isBefore, isAfter, parseISO } from 'date-fns';
import bookingIntegrationManager from '../../integrations/booking/architecture';
import { BookingIntegrationError } from '../../integrations/booking/errors';

/**
 * Rebooking Service
 * Handles automated rebooking logic using booking platform integrations
 */
export class RebookingService {
  constructor() {
    this.bookingManager = bookingIntegrationManager;
  }

  /**
   * Initialize the rebooking service with a specific booking platform
   * @param {string} platformName - Name of the booking platform
   * @param {Object} config - Configuration for the platform
   * @returns {Promise<boolean>} True if initialization is successful
   */
  async initialize(platformName, config) {
    try {
      await this.bookingManager.initializeIntegration(platformName, config);
      this.bookingManager.setActiveIntegration(platformName);
      return true;
    } catch (error) {
      console.error(`Failed to initialize rebooking service with ${platformName}:`, error);
      throw error;
    }
  }

  /**
   * Get the active booking integration
   * @returns {Object} Active booking integration
   */
  getBookingIntegration() {
    try {
      return this.bookingManager.getActiveIntegration();
    } catch (error) {
      throw new BookingIntegrationError('No active booking integration. Call initialize() first.');
    }
  }

  /**
   * Generate rebooking suggestions based on customer history
   * @param {string} customerId - ID of the customer
   * @param {Object} options - Options for generating suggestions
   * @returns {Promise<Array>} Array of rebooking suggestions
   */
  async generateRebookingSuggestions(customerId, options = {}) {
    const integration = this.getBookingIntegration();
    
    // Get customer's past appointments
    const pastAppointments = await this.getCustomerPastAppointments(customerId);
    
    if (pastAppointments.length === 0) {
      return [];
    }
    
    // Analyze appointment patterns
    const patterns = this.analyzeAppointmentPatterns(pastAppointments);
    
    // Generate suggestions based on patterns
    const suggestions = await this.createSuggestionsFromPatterns(patterns, customerId, options);
    
    return suggestions;
  }

  /**
   * Get customer's past appointments
   * @param {string} customerId - ID of the customer
   * @returns {Promise<Array>} Array of past appointments
   */
  async getCustomerPastAppointments(customerId) {
    const integration = this.getBookingIntegration();
    
    // Get all customer appointments
    const allAppointments = await integration.getCustomerAppointments(customerId);
    
    // Filter to only include past appointments
    const now = new Date();
    return allAppointments.filter(appointment => isBefore(new Date(appointment.endTime), now));
  }

  /**
   * Analyze appointment patterns from past appointments
   * @param {Array} appointments - Array of past appointments
   * @returns {Object} Appointment patterns
   */
  analyzeAppointmentPatterns(appointments) {
    // Sort appointments by date (oldest first)
    const sortedAppointments = [...appointments].sort((a, b) => 
      new Date(a.startTime) - new Date(b.startTime)
    );
    
    // Initialize patterns object
    const patterns = {
      services: {},
      providers: {},
      frequency: {
        weekly: 0,
        biweekly: 0,
        monthly: 0,
        quarterly: 0,
        irregular: 0
      },
      preferredDays: {
        0: 0, // Sunday
        1: 0, // Monday
        2: 0, // Tuesday
        3: 0, // Wednesday
        4: 0, // Thursday
        5: 0, // Friday
        6: 0  // Saturday
      },
      preferredTimes: {
        morning: 0,   // 6-12
        afternoon: 0, // 12-17
        evening: 0    // 17-22
      }
    };
    
    // Analyze service preferences
    sortedAppointments.forEach(appointment => {
      // Count service usage
      const serviceId = appointment.serviceId;
      patterns.services[serviceId] = (patterns.services[serviceId] || 0) + 1;
      
      // Count provider usage
      const providerId = appointment.providerId;
      patterns.providers[providerId] = (patterns.providers[providerId] || 0) + 1;
      
      // Count preferred days
      const day = new Date(appointment.startTime).getDay();
      patterns.preferredDays[day] += 1;
      
      // Count preferred times
      const hour = new Date(appointment.startTime).getHours();
      if (hour >= 6 && hour < 12) {
        patterns.preferredTimes.morning += 1;
      } else if (hour >= 12 && hour < 17) {
        patterns.preferredTimes.afternoon += 1;
      } else if (hour >= 17 && hour < 22) {
        patterns.preferredTimes.evening += 1;
      }
    });
    
    // Analyze appointment frequency
    if (sortedAppointments.length >= 2) {
      const intervals = [];
      
      for (let i = 1; i < sortedAppointments.length; i++) {
        const prevDate = new Date(sortedAppointments[i-1].startTime);
        const currDate = new Date(sortedAppointments[i].startTime);
        const daysDiff = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));
        intervals.push(daysDiff);
      }
      
      // Calculate average interval
      const avgInterval = intervals.reduce((sum, days) => sum + days, 0) / intervals.length;
      
      // Determine frequency pattern
      if (avgInterval <= 10) {
        patterns.frequency.weekly += 1;
      } else if (avgInterval <= 18) {
        patterns.frequency.biweekly += 1;
      } else if (avgInterval <= 40) {
        patterns.frequency.monthly += 1;
      } else if (avgInterval <= 100) {
        patterns.frequency.quarterly += 1;
      } else {
        patterns.frequency.irregular += 1;
      }
    }
    
    // Find most common patterns
    patterns.mostCommonService = this.findMostCommon(patterns.services);
    patterns.mostCommonProvider = this.findMostCommon(patterns.providers);
    patterns.mostCommonDay = this.findMostCommon(patterns.preferredDays);
    patterns.mostCommonTime = this.findMostCommon(patterns.preferredTimes);
    patterns.mostCommonFrequency = this.findMostCommon(patterns.frequency);
    
    return patterns;
  }

  /**
   * Find the most common item in an object of counts
   * @param {Object} countObj - Object with items as keys and counts as values
   * @returns {string} Most common item
   */
  findMostCommon(countObj) {
    let maxCount = 0;
    let mostCommon = null;
    
    for (const [item, count] of Object.entries(countObj)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = item;
      }
    }
    
    return mostCommon;
  }

  /**
   * Create rebooking suggestions based on appointment patterns
   * @param {Object} patterns - Appointment patterns
   * @param {string} customerId - ID of the customer
   * @param {Object} options - Options for generating suggestions
   * @returns {Promise<Array>} Array of rebooking suggestions
   */
  async createSuggestionsFromPatterns(patterns, customerId, options = {}) {
    const integration = this.getBookingIntegration();
    const now = new Date();
    const suggestions = [];
    
    // Determine next appointment date based on frequency
    let nextDate;
    switch (patterns.mostCommonFrequency) {
      case 'weekly':
        nextDate = addWeeks(now, 1);
        break;
      case 'biweekly':
        nextDate = addWeeks(now, 2);
        break;
      case 'monthly':
        nextDate = addMonths(now, 1);
        break;
      case 'quarterly':
        nextDate = addMonths(now, 3);
        break;
      default:
        // Default to 4 weeks if pattern is irregular
        nextDate = addWeeks(now, 4);
    }
    
    // Adjust to preferred day of week
    const preferredDay = parseInt(patterns.mostCommonDay);
    const currentDay = nextDate.getDay();
    const daysToAdd = (preferredDay - currentDay + 7) % 7;
    nextDate = addDays(nextDate, daysToAdd);
    
    // Set preferred time range
    let startHour, endHour;
    switch (patterns.mostCommonTime) {
      case 'morning':
        startHour = 9;
        endHour = 12;
        break;
      case 'afternoon':
        startHour = 13;
        endHour = 17;
        break;
      case 'evening':
        startHour = 17;
        endHour = 20;
        break;
      default:
        startHour = 9;
        endHour = 17;
    }
    
    // Set search range (1 week from next date)
    const searchStartDate = nextDate;
    const searchEndDate = addDays(nextDate, 7);
    
    // Get availability for preferred service and provider
    const availability = await integration.getAvailability(searchStartDate, searchEndDate, {
      serviceId: patterns.mostCommonService,
      providerId: patterns.mostCommonProvider
    });
    
    // Filter availability to preferred time range
    const filteredAvailability = availability.filter(slot => {
      const slotHour = new Date(slot.startTime).getHours();
      return slotHour >= startHour && slotHour < endHour;
    });
    
    // Sort by closest to preferred day and time
    filteredAvailability.sort((a, b) => {
      const dateA = new Date(a.startTime);
      const dateB = new Date(b.startTime);
      
      // First sort by day difference from next date
      const dayDiffA = Math.abs(dateA - nextDate);
      const dayDiffB = Math.abs(dateB - nextDate);
      
      if (dayDiffA !== dayDiffB) {
        return dayDiffA - dayDiffB;
      }
      
      // Then sort by hour difference from preferred time
      const hourA = dateA.getHours();
      const hourB = dateB.getHours();
      const preferredHour = (startHour + endHour) / 2;
      
      return Math.abs(hourA - preferredHour) - Math.abs(hourB - preferredHour);
    });
    
    // Take top 3 suggestions
    const topSuggestions = filteredAvailability.slice(0, 3);
    
    // Format suggestions with additional details
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
    
    return suggestions;
  }

  /**
   * Book an appointment from a suggestion
   * @param {Object} suggestion - Rebooking suggestion
   * @returns {Promise<Object>} Booking confirmation
   */
  async bookFromSuggestion(suggestion) {
    const integration = this.getBookingIntegration();
    
    const appointmentDetails = {
      customerId: suggestion.customerId,
      serviceId: suggestion.service.id,
      providerId: suggestion.provider.id,
      startTime: suggestion.timeSlot.startTime,
      notes: 'Automatically rebooked appointment'
    };
    
    return await integration.bookAppointment(appointmentDetails);
  }
}

// Create singleton instance
const rebookingService = new RebookingService();
export default rebookingService;

