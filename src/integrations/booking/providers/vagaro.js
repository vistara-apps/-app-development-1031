import axios from 'axios';
import { BookingIntegrationBase } from '../base';
import { OAuth2Handler } from '../auth';
import { normalizeError } from '../errors';
import { Appointment, Customer, Service, ServiceProvider, TimeSlot } from '../models';

/**
 * Vagaro booking platform integration
 */
export class VagaroIntegration extends BookingIntegrationBase {
  constructor(config) {
    super(config);
    this.name = 'Vagaro';
    this.baseUrl = 'https://api.vagaro.com/v1';
    this.auth = new OAuth2Handler({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      tokenUrl: 'https://api.vagaro.com/v1/oauth/token',
      authorizationUrl: 'https://api.vagaro.com/v1/oauth/authorize',
      redirectUri: config.redirectUri,
      scope: 'read write',
      refreshToken: config.refreshToken
    });
  }

  /**
   * Initialize the integration with Vagaro
   * @returns {Promise<boolean>} True if connection is successful
   */
  async initialize() {
    try {
      // Get a valid token
      await this.auth.getToken();
      this.isConnected = true;
      return true;
    } catch (error) {
      this.isConnected = false;
      throw normalizeError(error, this.name);
    }
  }

  /**
   * Create HTTP client with authentication
   * @returns {Object} Axios instance with auth headers
   */
  async createClient() {
    const token = await this.auth.getToken();
    return axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Get available appointment slots
   * @param {Date} startDate - Start date for availability search
   * @param {Date} endDate - End date for availability search
   * @param {Object} filters - Optional filters (service, provider, etc.)
   * @returns {Promise<Array>} Array of available time slots
   */
  async getAvailability(startDate, endDate, filters = {}) {
    try {
      const client = await this.createClient();
      
      // Format dates for Vagaro API
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();
      
      // Build query parameters
      const params = {
        startDate: formattedStartDate,
        endDate: formattedEndDate
      };
      
      // Add optional filters
      if (filters.serviceId) {
        params.serviceId = filters.serviceId;
      }
      
      if (filters.providerId) {
        params.employeeId = filters.providerId;
      }
      
      if (filters.locationId) {
        params.locationId = filters.locationId;
      }
      
      // Make API request
      const response = await client.get('/appointments/availability', { params });
      
      // Transform response to standardized format
      return response.data.map(slot => new TimeSlot({
        startTime: slot.startDateTime,
        endTime: slot.endDateTime,
        providerId: slot.employeeId,
        serviceId: slot.serviceId,
        platformData: slot
      }));
    } catch (error) {
      throw normalizeError(error, this.name);
    }
  }

  /**
   * Book an appointment
   * @param {Object} appointmentDetails - Details of the appointment to book
   * @returns {Promise<Object>} Booking confirmation details
   */
  async bookAppointment(appointmentDetails) {
    try {
      const client = await this.createClient();
      
      // Transform appointment details to Vagaro format
      const vagaroAppointment = {
        customerId: appointmentDetails.customerId,
        serviceId: appointmentDetails.serviceId,
        employeeId: appointmentDetails.providerId,
        startDateTime: appointmentDetails.startTime.toISOString(),
        notes: appointmentDetails.notes || ''
      };
      
      // Make API request
      const response = await client.post('/appointments', vagaroAppointment);
      
      // Transform response to standardized format
      return new Appointment({
        id: response.data.appointmentId,
        customerId: response.data.customerId,
        serviceId: response.data.serviceId,
        providerId: response.data.employeeId,
        startTime: response.data.startDateTime,
        endTime: response.data.endDateTime,
        status: response.data.status,
        notes: response.data.notes,
        price: response.data.price,
        platformData: response.data
      });
    } catch (error) {
      throw normalizeError(error, this.name);
    }
  }

  /**
   * Reschedule an existing appointment
   * @param {string} appointmentId - ID of the appointment to reschedule
   * @param {Object} newDetails - New appointment details
   * @returns {Promise<Object>} Updated appointment details
   */
  async rescheduleAppointment(appointmentId, newDetails) {
    try {
      const client = await this.createClient();
      
      // Transform appointment details to Vagaro format
      const vagaroUpdate = {
        appointmentId,
        startDateTime: newDetails.startTime.toISOString()
      };
      
      // Add optional updates
      if (newDetails.providerId) {
        vagaroUpdate.employeeId = newDetails.providerId;
      }
      
      if (newDetails.notes) {
        vagaroUpdate.notes = newDetails.notes;
      }
      
      // Make API request
      const response = await client.put(`/appointments/${appointmentId}`, vagaroUpdate);
      
      // Transform response to standardized format
      return new Appointment({
        id: response.data.appointmentId,
        customerId: response.data.customerId,
        serviceId: response.data.serviceId,
        providerId: response.data.employeeId,
        startTime: response.data.startDateTime,
        endTime: response.data.endDateTime,
        status: response.data.status,
        notes: response.data.notes,
        price: response.data.price,
        platformData: response.data
      });
    } catch (error) {
      throw normalizeError(error, this.name);
    }
  }

  /**
   * Cancel an appointment
   * @param {string} appointmentId - ID of the appointment to cancel
   * @returns {Promise<boolean>} True if cancellation is successful
   */
  async cancelAppointment(appointmentId) {
    try {
      const client = await this.createClient();
      
      // Make API request
      await client.delete(`/appointments/${appointmentId}`);
      
      return true;
    } catch (error) {
      throw normalizeError(error, this.name);
    }
  }

  /**
   * Get customer details
   * @param {string} customerId - ID of the customer
   * @returns {Promise<Object>} Customer details
   */
  async getCustomer(customerId) {
    try {
      const client = await this.createClient();
      
      // Make API request
      const response = await client.get(`/customers/${customerId}`);
      
      // Transform response to standardized format
      return new Customer({
        id: response.data.customerId,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        phone: response.data.phone,
        notes: response.data.notes,
        platformData: response.data
      });
    } catch (error) {
      throw normalizeError(error, this.name);
    }
  }

  /**
   * Get appointment details
   * @param {string} appointmentId - ID of the appointment
   * @returns {Promise<Object>} Appointment details
   */
  async getAppointment(appointmentId) {
    try {
      const client = await this.createClient();
      
      // Make API request
      const response = await client.get(`/appointments/${appointmentId}`);
      
      // Transform response to standardized format
      return new Appointment({
        id: response.data.appointmentId,
        customerId: response.data.customerId,
        serviceId: response.data.serviceId,
        providerId: response.data.employeeId,
        startTime: response.data.startDateTime,
        endTime: response.data.endDateTime,
        status: response.data.status,
        notes: response.data.notes,
        price: response.data.price,
        platformData: response.data
      });
    } catch (error) {
      throw normalizeError(error, this.name);
    }
  }

  /**
   * Get all appointments for a customer
   * @param {string} customerId - ID of the customer
   * @param {Object} filters - Optional filters (date range, status, etc.)
   * @returns {Promise<Array>} Array of appointments
   */
  async getCustomerAppointments(customerId, filters = {}) {
    try {
      const client = await this.createClient();
      
      // Build query parameters
      const params = { customerId };
      
      // Add optional filters
      if (filters.startDate) {
        params.startDate = filters.startDate.toISOString();
      }
      
      if (filters.endDate) {
        params.endDate = filters.endDate.toISOString();
      }
      
      if (filters.status) {
        params.status = filters.status;
      }
      
      // Make API request
      const response = await client.get('/appointments', { params });
      
      // Transform response to standardized format
      return response.data.map(appointment => new Appointment({
        id: appointment.appointmentId,
        customerId: appointment.customerId,
        serviceId: appointment.serviceId,
        providerId: appointment.employeeId,
        startTime: appointment.startDateTime,
        endTime: appointment.endDateTime,
        status: appointment.status,
        notes: appointment.notes,
        price: appointment.price,
        platformData: appointment
      }));
    } catch (error) {
      throw normalizeError(error, this.name);
    }
  }

  /**
   * Get all services offered
   * @returns {Promise<Array>} Array of services
   */
  async getServices() {
    try {
      const client = await this.createClient();
      
      // Make API request
      const response = await client.get('/services');
      
      // Transform response to standardized format
      return response.data.map(service => new Service({
        id: service.serviceId,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category: service.category,
        platformData: service
      }));
    } catch (error) {
      throw normalizeError(error, this.name);
    }
  }

  /**
   * Get all service providers/staff
   * @returns {Promise<Array>} Array of service providers
   */
  async getServiceProviders() {
    try {
      const client = await this.createClient();
      
      // Make API request
      const response = await client.get('/employees');
      
      // Transform response to standardized format
      return response.data.map(employee => new ServiceProvider({
        id: employee.employeeId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        services: employee.services.map(service => service.serviceId),
        platformData: employee
      }));
    } catch (error) {
      throw normalizeError(error, this.name);
    }
  }
}

