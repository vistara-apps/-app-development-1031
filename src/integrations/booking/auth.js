import axios from 'axios';

/**
 * Base authentication handler for booking platform integrations
 */
export class AuthHandler {
  constructor(config) {
    this.config = config;
    this.token = null;
    this.tokenExpiry = null;
  }

  /**
   * Check if the current token is valid
   * @returns {boolean} True if token is valid and not expired
   */
  isTokenValid() {
    if (!this.token || !this.tokenExpiry) {
      return false;
    }
    
    // Check if token is expired (with 5 minute buffer)
    const now = new Date();
    const bufferMs = 5 * 60 * 1000; // 5 minutes in milliseconds
    return now.getTime() < this.tokenExpiry.getTime() - bufferMs;
  }

  /**
   * Get a valid authentication token
   * @returns {Promise<string>} Valid authentication token
   */
  async getToken() {
    if (this.isTokenValid()) {
      return this.token;
    }
    
    return await this.refreshToken();
  }

  /**
   * Refresh the authentication token
   * @returns {Promise<string>} New authentication token
   */
  async refreshToken() {
    throw new Error('Method not implemented: refreshToken()');
  }
}

/**
 * OAuth2 authentication handler
 */
export class OAuth2Handler extends AuthHandler {
  constructor(config) {
    super(config);
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.tokenUrl = config.tokenUrl;
    this.authorizationUrl = config.authorizationUrl;
    this.redirectUri = config.redirectUri;
    this.scope = config.scope;
    this.refreshToken = config.refreshToken;
  }

  /**
   * Generate the authorization URL for OAuth2 flow
   * @returns {string} Authorization URL
   */
  getAuthorizationUrl() {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.scope
    });
    
    return `${this.authorizationUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   * @param {string} code - Authorization code from OAuth2 redirect
   * @returns {Promise<Object>} Token response
   */
  async exchangeCodeForToken(code) {
    try {
      const response = await axios.post(this.tokenUrl, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code'
      });
      
      this.token = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      
      // Set token expiry
      const expiresIn = response.data.expires_in || 3600; // Default to 1 hour
      this.tokenExpiry = new Date(Date.now() + expiresIn * 1000);
      
      return {
        accessToken: this.token,
        refreshToken: this.refreshToken,
        expiresIn
      };
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw new Error('Failed to exchange authorization code for token');
    }
  }

  /**
   * Refresh the access token using refresh token
   * @returns {Promise<string>} New access token
   */
  async refreshToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await axios.post(this.tokenUrl, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token'
      });
      
      this.token = response.data.access_token;
      
      // Update refresh token if provided
      if (response.data.refresh_token) {
        this.refreshToken = response.data.refresh_token;
      }
      
      // Set token expiry
      const expiresIn = response.data.expires_in || 3600; // Default to 1 hour
      this.tokenExpiry = new Date(Date.now() + expiresIn * 1000);
      
      return this.token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh access token');
    }
  }
}

/**
 * API Key authentication handler
 */
export class ApiKeyHandler extends AuthHandler {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKey;
    this.apiKeyHeaderName = config.apiKeyHeaderName || 'X-API-Key';
  }

  /**
   * Get headers for API requests
   * @returns {Object} Headers with API key
   */
  getHeaders() {
    return {
      [this.apiKeyHeaderName]: this.apiKey
    };
  }

  /**
   * API Key auth doesn't need token refresh
   * @returns {Promise<string>} API key
   */
  async refreshToken() {
    // API Key doesn't expire, so we just return it
    this.token = this.apiKey;
    this.tokenExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Set expiry to 1 year
    return this.token;
  }
}

