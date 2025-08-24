import { BookingIntegrationError } from './errors';

/**
 * Booking Integration Factory
 * Creates and manages booking platform integrations
 */
export class BookingIntegrationFactory {
  constructor() {
    this.integrations = {};
    this.activeIntegration = null;
  }

  /**
   * Register a booking platform integration
   * @param {string} name - Name of the integration
   * @param {Class} IntegrationClass - Integration class
   */
  registerIntegration(name, IntegrationClass) {
    this.integrations[name] = IntegrationClass;
  }

  /**
   * Create an instance of a booking platform integration
   * @param {string} name - Name of the integration
   * @param {Object} config - Configuration for the integration
   * @returns {Object} Integration instance
   */
  createIntegration(name, config) {
    if (!this.integrations[name]) {
      throw new BookingIntegrationError(`Integration '${name}' is not registered`);
    }
    
    const IntegrationClass = this.integrations[name];
    return new IntegrationClass(config);
  }

  /**
   * Set the active integration
   * @param {string} name - Name of the integration
   * @param {Object} config - Configuration for the integration
   * @returns {Object} Active integration instance
   */
  setActiveIntegration(name, config) {
    this.activeIntegration = this.createIntegration(name, config);
    return this.activeIntegration;
  }

  /**
   * Get the active integration
   * @returns {Object} Active integration instance
   */
  getActiveIntegration() {
    if (!this.activeIntegration) {
      throw new BookingIntegrationError('No active integration set');
    }
    return this.activeIntegration;
  }
}

// Create singleton instance
const bookingIntegrationFactory = new BookingIntegrationFactory();

/**
 * Booking Integration Manager
 * Provides a unified interface for working with booking platforms
 */
export class BookingIntegrationManager {
  constructor() {
    this.factory = bookingIntegrationFactory;
    this.integrations = {};
  }

  /**
   * Register a booking platform integration
   * @param {string} name - Name of the integration
   * @param {Class} IntegrationClass - Integration class
   */
  registerIntegration(name, IntegrationClass) {
    this.factory.registerIntegration(name, IntegrationClass);
  }

  /**
   * Initialize an integration with configuration
   * @param {string} name - Name of the integration
   * @param {Object} config - Configuration for the integration
   * @returns {Promise<Object>} Initialized integration instance
   */
  async initializeIntegration(name, config) {
    const integration = this.factory.createIntegration(name, config);
    await integration.initialize();
    this.integrations[name] = integration;
    return integration;
  }

  /**
   * Set the active integration
   * @param {string} name - Name of the integration
   * @returns {Object} Active integration instance
   */
  setActiveIntegration(name) {
    if (!this.integrations[name]) {
      throw new BookingIntegrationError(`Integration '${name}' is not initialized`);
    }
    
    this.factory.activeIntegration = this.integrations[name];
    return this.factory.activeIntegration;
  }

  /**
   * Get the active integration
   * @returns {Object} Active integration instance
   */
  getActiveIntegration() {
    return this.factory.getActiveIntegration();
  }

  /**
   * Get all initialized integrations
   * @returns {Object} Map of integration instances
   */
  getAllIntegrations() {
    return this.integrations;
  }

  /**
   * Test connection to a booking platform
   * @param {string} name - Name of the integration
   * @returns {Promise<boolean>} True if connection is successful
   */
  async testConnection(name) {
    if (!this.integrations[name]) {
      throw new BookingIntegrationError(`Integration '${name}' is not initialized`);
    }
    
    return await this.integrations[name].testConnection();
  }
}

// Create singleton instance
const bookingIntegrationManager = new BookingIntegrationManager();
export default bookingIntegrationManager;

