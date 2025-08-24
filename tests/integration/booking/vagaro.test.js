/**
 * Vagaro Integration Tests
 * 
 * These tests verify the functionality of the Vagaro booking platform integration.
 * 
 * Note: These tests require a valid Vagaro sandbox account and credentials.
 * Set the following environment variables before running:
 * - VAGARO_CLIENT_ID
 * - VAGARO_CLIENT_SECRET
 * - VAGARO_REDIRECT_URI
 * - VAGARO_REFRESH_TOKEN (optional)
 */

import { VagaroIntegration } from '../../../src/integrations/booking/providers/vagaro';
import { Appointment, Customer, Service, ServiceProvider } from '../../../src/integrations/booking/models';

// Test configuration
const config = {
  clientId: process.env.VAGARO_CLIENT_ID || 'test-client-id',
  clientSecret: process.env.VAGARO_CLIENT_SECRET || 'test-client-secret',
  redirectUri: process.env.VAGARO_REDIRECT_URI || 'https://example.com/callback',
  refreshToken: process.env.VAGARO_REFRESH_TOKEN
};

// Mock data for tests
const mockAppointmentData = {
  customerId: 'test-customer-id',
  serviceId: 'test-service-id',
  providerId: 'test-provider-id',
  startTime: new Date(Date.now() + 86400000), // Tomorrow
  notes: 'Test appointment created by integration tests'
};

// Test suite
describe('Vagaro Integration', () => {
  let integration;
  
  beforeAll(async () => {
    // Skip tests if running in CI environment without credentials
    if (process.env.CI && !process.env.VAGARO_CLIENT_ID) {
      console.warn('Skipping Vagaro integration tests in CI environment without credentials');
      return;
    }
    
    // Initialize integration
    integration = new VagaroIntegration(config);
    
    try {
      await integration.initialize();
    } catch (error) {
      console.error('Failed to initialize Vagaro integration:', error);
      throw error;
    }
  });
  
  // Test initialization
  test('should initialize successfully', () => {
    expect(integration.isConnected).toBe(true);
  });
  
  // Test getting services
  test('should retrieve services', async () => {
    const services = await integration.getServices();
    
    expect(Array.isArray(services)).toBe(true);
    
    if (services.length > 0) {
      const service = services[0];
      expect(service).toBeInstanceOf(Service);
      expect(service.id).toBeDefined();
      expect(service.name).toBeDefined();
    }
  });
  
  // Test getting service providers
  test('should retrieve service providers', async () => {
    const providers = await integration.getServiceProviders();
    
    expect(Array.isArray(providers)).toBe(true);
    
    if (providers.length > 0) {
      const provider = providers[0];
      expect(provider).toBeInstanceOf(ServiceProvider);
      expect(provider.id).toBeDefined();
      expect(provider.firstName).toBeDefined();
      expect(provider.lastName).toBeDefined();
    }
  });
  
  // Test getting availability
  test('should retrieve availability', async () => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // One week from now
    
    const availability = await integration.getAvailability(startDate, endDate);
    
    expect(Array.isArray(availability)).toBe(true);
  });
  
  // Test booking flow (create, get, cancel)
  describe('Booking Flow', () => {
    let appointmentId;
    
    // Only run these tests if not in CI environment
    beforeAll(() => {
      if (process.env.CI) {
        console.warn('Skipping booking flow tests in CI environment');
      }
    });
    
    test('should book an appointment', async () => {
      if (process.env.CI) return;
      
      // Get a real service and provider for testing
      const services = await integration.getServices();
      const providers = await integration.getServiceProviders();
      
      if (services.length === 0 || providers.length === 0) {
        console.warn('Skipping test: No services or providers available');
        return;
      }
      
      const appointmentData = {
        ...mockAppointmentData,
        serviceId: services[0].id,
        providerId: providers[0].id
      };
      
      const appointment = await integration.bookAppointment(appointmentData);
      
      expect(appointment).toBeInstanceOf(Appointment);
      expect(appointment.id).toBeDefined();
      
      // Save appointment ID for subsequent tests
      appointmentId = appointment.id;
    });
    
    test('should retrieve an appointment', async () => {
      if (process.env.CI || !appointmentId) return;
      
      const appointment = await integration.getAppointment(appointmentId);
      
      expect(appointment).toBeInstanceOf(Appointment);
      expect(appointment.id).toBe(appointmentId);
    });
    
    test('should cancel an appointment', async () => {
      if (process.env.CI || !appointmentId) return;
      
      const result = await integration.cancelAppointment(appointmentId);
      
      expect(result).toBe(true);
    });
  });
  
  // Test error handling
  test('should handle invalid appointment booking', async () => {
    // Invalid appointment data (missing required fields)
    const invalidAppointmentData = {
      startTime: new Date()
    };
    
    await expect(integration.bookAppointment(invalidAppointmentData))
      .rejects.toThrow();
  });
  
  // Test connection validation
  test('should validate connection', async () => {
    const isValid = await integration.testConnection();
    expect(isValid).toBe(true);
  });
});

