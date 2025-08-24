/**
 * Phorest integration configuration
 */
export default {
  // OAuth2 credentials
  clientId: process.env.PHOREST_CLIENT_ID || '',
  clientSecret: process.env.PHOREST_CLIENT_SECRET || '',
  redirectUri: process.env.PHOREST_REDIRECT_URI || 'https://yourdomain.com/auth/phorest/callback',
  
  // Optional refresh token (if already authenticated)
  refreshToken: process.env.PHOREST_REFRESH_TOKEN || '',
  
  // Business and branch IDs
  businessId: process.env.PHOREST_BUSINESS_ID || '',
  branchId: process.env.PHOREST_BRANCH_ID || '',
  
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

