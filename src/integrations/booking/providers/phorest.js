import axios from 'axios';
import { BookingIntegrationBase } from '../base';
import { OAuth2Handler } from '../auth';
import { normalizeError } from '../errors';
import { Appointment, Customer, Service, ServiceProvider, TimeSlot } from '../models';

/**
 * Phorest booking platform integration
 */
export class PhorestIntegration extends BookingIntegrationBase {
  constructor(config) {
    super(config);
    this.name = 'Phorest';
    this.baseUrl = 'https://api.phorest.com/third_party_api/v1';
    this.auth = new OAuth2Handler({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      tokenUrl: 'https://api.phorest.com/oauth/token',
      authorizationUrl: 'https://api.phorest.com/oauth/authorize',
      redirectUri: config.redirectUri,
      scope: 'read write',
      refreshToken: config.refreshToken
    });
    this.businessId = config.businessId;
    this.branchId = config.branchId;
  }

  /**
   * Initialize the integration with Phorest
   * @returns {Promise<boolean>} True if connection is successful
   */
  async initialize() {
    try {
      // Get a valid token
      await this.auth.getToken();
      
      // Test connection by getting business information
      const client = await this.createClient();
      await client.get(`/businesses/${this.businessId}`);
      
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
      
      // Format dates for Phorest API
      const formattedStartDate = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const formattedEndDate = endDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
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
        params.staffId = filters.providerId;
      }
      
      // Make API request
      const response = await client.get(
        `/businesses/${this.businessId}/branches/${this.branchId}/availability`,
        { params }
      );
      
      // Transform response to standardized format
      return response.data.map(slot => new TimeSlot({
        startTime: slot.startTime,
        endTime: slot.endTime,
        providerId: slot.staffId,
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
      
      // Transform appointment details to Phorest format
      const phorestAppointment = {
        clientId: appointmentDetails.customerId,
        serviceId: appointmentDetails.serviceId,
        staffId: appointmentDetails.providerId,
        startTime: appointmentDetails.startTime.toISOString(),
        notes: appointmentDetails.notes || ''
      };
      
      // Make API request
      const response = await client.post(
        `/businesses/${this.businessId}/branches/${this.branchId}/appointments`,
        phorestAppointment
      );
      
      // Transform response to standardized format
      return new Appointment({
        id: response.data.id,
        customerId: response.data.clientId,
        serviceId: response.data.serviceId,
        providerId: response.data.staffId,
        startTime: response.data.startTime,
        endTime: response.data.endTime,
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
      
      // Transform appointment details to Phorest format
      const phorestUpdate = {
        startTime: newDetails.startTime.toISOString()
      };
      
      // Add optional updates
      if (newDetails.providerId) {
        phorestUpdate.staffId = newDetails.providerId;
      }
      
      if (newDetails.notes) {
        phorestUpdate.notes = newDetails.notes;
      }
      
      // Make API request
      const response = await client.patch(
        `/businesses/${this.businessId}/branches/${this.branchId}/appointments/${appointmentId}`,
        phorestUpdate
      );
      
      // Transform response to standardized format
      return new Appointment({
        id: response.data.id,
        customerId: response.data.clientId,
        serviceId: response.data.serviceId,
        providerId: response.data.staffId,
        startTime: response.data.startTime,
        endTime: response.data.endTime,
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
      await client.delete(
        `/businesses/${this.businessId}/branches/${this.branchId}/appointments/${appointmentId}`
      );
      
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
      const response = await client.get(
        `/businesses/${this.businessId}/branches/${this.branchId}/clients/${customerId}`
      );
      
      // Transform response to standardized format
      return new Customer({
        id: response.data.id,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        phone: response.data.mobile,
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
      const response = await client.get(
        `/businesses/${this.businessId}/branches/${this.branchId}/appointments/${appointmentId}`
      );
      
      // Transform response to standardized format
      return new Appointment({
        id: response.data.id,
        customerId: response.data.clientId,
        serviceId: response.data.serviceId,
        providerId: response.data.staffId,
        startTime: response.data.startTime,
        endTime: response.data.endTime,
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
      const params = {
        clientId: customerId
      };
      
      // Add optional filters
      if (filters.startDate) {
        params.startDate = filters.startDate.toISOString().split('T')[0]; // YYYY-MM-DD
      }
      
      if (filters.endDate) {
        params.endDate = filters.endDate.toISOString().split('T')[0]; // YYYY-MM-DD
      }
      
      if (filters.status) {
        params.status = filters.status;
      }
      
      // Make API request
      const response = await client.get(
        `/businesses/${this.businessId}/branches/${this.branchId}/appointments`,
        { params }
      );
      
      // Transform response to standardized format
      return response.data.map(appointment => new Appointment({
        id: appointment.id,
        customerId: appointment.clientId,
        serviceId: appointment.serviceId,
        providerId: appointment.staffId,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
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
      const response = await client.get(
        `/businesses/${this.businessId}/branches/${this.branchId}/services`
      );
      
      // Transform response to standardized format
      return response.data.map(service => new Service({
        id: service.id,
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
      const response = await client.get(
        `/businesses/${this.businessId}/branches/${this.branchId}/staff`
      );
      
      // Transform response to standardized format
      return response.data.map(staff => new ServiceProvider({
        id: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        phone: staff.mobile,
        services: staff.serviceIds,
        platformData: staff
      }));
    } catch (error) {
      throw normalizeError(error, this.name);
    }
  }
}

