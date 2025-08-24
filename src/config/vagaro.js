/**
 * Vagaro integration configuration
 */
export default {
  // OAuth2 credentials
  clientId: process.env.VAGARO_CLIENT_ID || '',
  clientSecret: process.env.VAGARO_CLIENT_SECRET || '',
  redirectUri: process.env.VAGARO_REDIRECT_URI || 'https://yourdomain.com/auth/vagaro/callback',
  
  // Optional refresh token (if already authenticated)
  refreshToken: process.env.VAGARO_REFRESH_TOKEN || '',
  
  // API configuration
  apiVersion: 'v1',
  
  // Retry configuration
  maxRetries: 3,
  retryDelay: 1000, // milliseconds
  
  // Rate limiting
  rateLimit: {
    maxRequests: 100,
    perTimeWindow: 60 * 1000 // 1 minute in milliseconds
  }
};

