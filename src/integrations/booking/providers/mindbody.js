import axios from 'axios';
import { BookingIntegrationBase } from '../base';
import { ApiKeyHandler } from '../auth';
import { normalizeError } from '../errors';
import { Appointment, Customer, Service, ServiceProvider, TimeSlot } from '../models';

/**
 * Mindbody booking platform integration
 */
export class MindbodyIntegration extends BookingIntegrationBase {
  constructor(config) {
    super(config);
    this.name = 'Mindbody';
    this.baseUrl = 'https://api.mindbodyonline.com/public/v6';
    this.auth = new ApiKeyHandler({
      apiKey: config.apiKey,
      apiKeyHeaderName: 'API-Key'
    });
    this.siteId = config.siteId;
  }

  /**
   * Initialize the integration with Mindbody
   * @returns {Promise<boolean>} True if connection is successful
   */
  async initialize() {
    try {
      // Test connection by getting site information
      const client = await this.createClient();
      await client.get('/site', {
        params: {
          siteId: this.siteId
        }
      });
      
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
    const headers = this.auth.getHeaders();
    
    return axios.create({
      baseURL: this.baseUrl,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'SiteId': this.siteId
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
      
      // Format dates for Mindbody API
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();
      
      // Build query parameters
      const params = {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        siteId: this.siteId
      };
      
      // Add optional filters
      if (filters.serviceId) {
        params.serviceIds = filters.serviceId;
      }
      
      if (filters.providerId) {
        params.staffIds = filters.providerId;
      }
      
      if (filters.locationId) {
        params.locationIds = filters.locationId;
      }
      
      // Make API request
      const response = await client.get('/appointment/availabilities', { params });
      
      // Transform response to standardized format
      return response.data.Availabilities.map(slot => new TimeSlot({
        startTime: slot.StartDateTime,
        endTime: slot.EndDateTime,
        providerId: slot.StaffId,
        serviceId: slot.ServiceId,
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
      
      // Transform appointment details to Mindbody format
      const mindbodyAppointment = {
        ClientId: appointmentDetails.customerId,
        ServiceId: appointmentDetails.serviceId,
        StaffId: appointmentDetails.providerId,
        StartDateTime: appointmentDetails.startTime.toISOString(),
        Notes: appointmentDetails.notes || ''
      };
      
      // Make API request
      const response = await client.post('/appointment/bookappointment', mindbodyAppointment);
      
      // Transform response to standardized format
      return new Appointment({
        id: response.data.Appointment.Id,
        customerId: response.data.Appointment.ClientId,
        serviceId: response.data.Appointment.ServiceId,
        providerId: response.data.Appointment.StaffId,
        startTime: response.data.Appointment.StartDateTime,
        endTime: response.data.Appointment.EndDateTime,
        status: response.data.Appointment.Status,
        notes: response.data.Appointment.Notes,
        price: response.data.Appointment.Price,
        platformData: response.data.Appointment
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
      
      // Transform appointment details to Mindbody format
      const mindbodyUpdate = {
        AppointmentId: appointmentId,
        StartDateTime: newDetails.startTime.toISOString()
      };
      
      // Add optional updates
      if (newDetails.providerId) {
        mindbodyUpdate.StaffId = newDetails.providerId;
      }
      
      if (newDetails.notes) {
        mindbodyUpdate.Notes = newDetails.notes;
      }
      
      // Make API request
      const response = await client.put('/appointment/updateappointment', mindbodyUpdate);
      
      // Transform response to standardized format
      return new Appointment({
        id: response.data.Appointment.Id,
        customerId: response.data.Appointment.ClientId,
        serviceId: response.data.Appointment.ServiceId,
        providerId: response.data.Appointment.StaffId,
        startTime: response.data.Appointment.StartDateTime,
        endTime: response.data.Appointment.EndDateTime,
        status: response.data.Appointment.Status,
        notes: response.data.Appointment.Notes,
        price: response.data.Appointment.Price,
        platformData: response.data.Appointment
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
      await client.delete('/appointment/cancelappointment', {
        data: {
          AppointmentId: appointmentId
        }
      });
      
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
      const response = await client.get('/client/clients', {
        params: {
          clientId: customerId
        }
      });
      
      const clientData = response.data.Clients[0];
      
      // Transform response to standardized format
      return new Customer({
        id: clientData.Id,
        firstName: clientData.FirstName,
        lastName: clientData.LastName,
        email: clientData.Email,
        phone: clientData.MobilePhone,
        notes: clientData.Notes,
        platformData: clientData
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
      const response = await client.get('/appointment/appointments', {
        params: {
          appointmentIds: appointmentId
        }
      });
      
      const appointmentData = response.data.Appointments[0];
      
      // Transform response to standardized format
      return new Appointment({
        id: appointmentData.Id,
        customerId: appointmentData.ClientId,
        serviceId: appointmentData.ServiceId,
        providerId: appointmentData.StaffId,
        startTime: appointmentData.StartDateTime,
        endTime: appointmentData.EndDateTime,
        status: appointmentData.Status,
        notes: appointmentData.Notes,
        price: appointmentData.Price,
        platformData: appointmentData
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
        params.startDate = filters.startDate.toISOString();
      }
      
      if (filters.endDate) {
        params.endDate = filters.endDate.toISOString();
      }
      
      // Make API request
      const response = await client.get('/appointment/clientschedule', { params });
      
      // Transform response to standardized format
      return response.data.Appointments.map(appointment => new Appointment({
        id: appointment.Id,
        customerId: appointment.ClientId,
        serviceId: appointment.ServiceId,
        providerId: appointment.StaffId,
        startTime: appointment.StartDateTime,
        endTime: appointment.EndDateTime,
        status: appointment.Status,
        notes: appointment.Notes,
        price: appointment.Price,
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
      const response = await client.get('/appointment/services');
      
      // Transform response to standardized format
      return response.data.Services.map(service => new Service({
        id: service.Id,
        name: service.Name,
        description: service.Description,
        duration: service.Duration,
        price: service.Price,
        category: service.Category,
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
      const response = await client.get('/staff/staff');
      
      // Transform response to standardized format
      return response.data.StaffMembers.map(staff => new ServiceProvider({
        id: staff.Id,
        firstName: staff.FirstName,
        lastName: staff.LastName,
        email: staff.Email,
        phone: staff.MobilePhone,
        services: staff.ProviderIDs,
        platformData: staff
      }));
    } catch (error) {
      throw normalizeError(error, this.name);
    }
  }
}

