import rebookingService from './index';
import { BookingIntegrationError } from '../../integrations/booking/errors';

/**
 * Confirmation Service
 * Handles booking confirmations and notifications
 */
export class ConfirmationService {
  constructor() {
    this.rebookingService = rebookingService;
  }

  /**
   * Confirm a booking from a suggestion
   * @param {Object} suggestion - Rebooking suggestion
   * @returns {Promise<Object>} Booking confirmation
   */
  async confirmBooking(suggestion) {
    try {
      // Book the appointment
      const booking = await this.rebookingService.bookFromSuggestion(suggestion);
      
      // Generate confirmation details
      const confirmationDetails = this.generateConfirmationDetails(booking, suggestion);
      
      return confirmationDetails;
    } catch (error) {
      console.error('Error confirming booking:', error);
      throw error;
    }
  }

  /**
   * Generate confirmation details
   * @param {Object} booking - Booking object
   * @param {Object} suggestion - Original suggestion
   * @returns {Object} Confirmation details
   */
  generateConfirmationDetails(booking, suggestion) {
    return {
      booking,
      confirmationId: booking.id,
      service: suggestion.service,
      provider: suggestion.provider,
      dateTime: booking.startTime,
      formattedDateTime: this.formatDateTime(booking.startTime),
      duration: suggestion.service.duration,
      price: suggestion.service.price,
      cancellationPolicy: this.getCancellationPolicy(),
      confirmationMessage: this.generateConfirmationMessage(booking, suggestion)
    };
  }

  /**
   * Format date and time for display
   * @param {string|Date} dateTime - Date and time
   * @returns {string} Formatted date and time
   */
  formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  /**
   * Get cancellation policy
   * @returns {string} Cancellation policy
   */
  getCancellationPolicy() {
    return 'Cancellations must be made at least 24 hours before the appointment to avoid charges.';
  }

  /**
   * Generate confirmation message
   * @param {Object} booking - Booking object
   * @param {Object} suggestion - Original suggestion
   * @returns {string} Confirmation message
   */
  generateConfirmationMessage(booking, suggestion) {
    const serviceName = suggestion.service.name;
    const providerName = suggestion.provider.getFullName();
    const dateTime = this.formatDateTime(booking.startTime);
    
    return `Your appointment for ${serviceName} with ${providerName} on ${dateTime} has been confirmed. Your confirmation number is ${booking.id}.`;
  }

  /**
   * Cancel a booking
   * @param {string} bookingId - ID of the booking to cancel
   * @returns {Promise<Object>} Cancellation confirmation
   */
  async cancelBooking(bookingId) {
    try {
      const integration = this.rebookingService.getBookingIntegration();
      
      // Get booking details before cancellation
      const booking = await integration.getAppointment(bookingId);
      
      // Cancel the booking
      const success = await integration.cancelAppointment(bookingId);
      
      if (!success) {
        throw new BookingIntegrationError('Failed to cancel booking');
      }
      
      // Generate cancellation confirmation
      return {
        bookingId,
        cancelled: true,
        cancellationDateTime: new Date(),
        originalDateTime: booking.startTime,
        formattedOriginalDateTime: this.formatDateTime(booking.startTime),
        cancellationMessage: `Your appointment on ${this.formatDateTime(booking.startTime)} has been cancelled.`
      };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  /**
   * Reschedule a booking
   * @param {string} bookingId - ID of the booking to reschedule
   * @param {Object} newDetails - New booking details
   * @returns {Promise<Object>} Rescheduling confirmation
   */
  async rescheduleBooking(bookingId, newDetails) {
    try {
      const integration = this.rebookingService.getBookingIntegration();
      
      // Get original booking details
      const originalBooking = await integration.getAppointment(bookingId);
      
      // Reschedule the booking
      const updatedBooking = await integration.rescheduleAppointment(bookingId, newDetails);
      
      // Get service and provider details
      const [service, provider] = await Promise.all([
        integration.getServices()
          .then(services => services.find(s => s.id === updatedBooking.serviceId)),
        integration.getServiceProviders()
          .then(providers => providers.find(p => p.id === updatedBooking.providerId))
      ]);
      
      // Generate rescheduling confirmation
      return {
        booking: updatedBooking,
        originalDateTime: originalBooking.startTime,
        formattedOriginalDateTime: this.formatDateTime(originalBooking.startTime),
        newDateTime: updatedBooking.startTime,
        formattedNewDateTime: this.formatDateTime(updatedBooking.startTime),
        service,
        provider,
        reschedulingMessage: `Your appointment has been rescheduled from ${this.formatDateTime(originalBooking.startTime)} to ${this.formatDateTime(updatedBooking.startTime)}.`
      };
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      throw error;
    }
  }
}

// Create singleton instance
const confirmationService = new ConfirmationService();
export default confirmationService;

