/**
 * Mindbody integration configuration
 */
export default {
  // API credentials
  apiKey: process.env.MINDBODY_API_KEY || '',
  siteId: process.env.MINDBODY_SITE_ID || '',
  
  // API configuration
  apiVersion: 'v6',
  
  // Retry configuration
  maxRetries: 3,
  retryDelay: 1000, // milliseconds
  
  // Rate limiting
  rateLimit: {
    maxRequests: 100,
    perTimeWindow: 60 * 1000 // 1 minute in milliseconds
  }
};

