/**
 * Booking Integrations Monitoring
 * 
 * This module provides monitoring and health checking for booking platform integrations.
 * It tracks API call success rates, response times, error rates, and integration health.
 */

import bookingIntegrationManager from '../src/integrations/booking/architecture';

/**
 * Integration metrics
 */
const metrics = {
  apiCalls: {
    total: 0,
    success: 0,
    failure: 0,
    byPlatform: {}
  },
  responseTimes: {
    average: 0,
    byPlatform: {}
  },
  errors: {
    byType: {},
    byPlatform: {}
  },
  rateLimit: {
    remaining: {},
    resetTime: {}
  },
  webhooks: {
    received: 0,
    processed: 0,
    failed: 0,
    byPlatform: {}
  },
  lastHealthCheck: {
    timestamp: null,
    status: {},
    details: {}
  }
};

/**
 * Track an API call
 * @param {string} platform - Platform name
 * @param {string} endpoint - API endpoint
 * @param {boolean} success - Whether the call was successful
 * @param {number} responseTime - Response time in milliseconds
 * @param {Object} error - Error object if the call failed
 */
export function trackApiCall(platform, endpoint, success, responseTime, error = null) {
  // Update total metrics
  metrics.apiCalls.total++;
  
  if (success) {
    metrics.apiCalls.success++;
  } else {
    metrics.apiCalls.failure++;
  }
  
  // Update platform-specific metrics
  if (!metrics.apiCalls.byPlatform[platform]) {
    metrics.apiCalls.byPlatform[platform] = {
      total: 0,
      success: 0,
      failure: 0,
      byEndpoint: {}
    };
  }
  
  const platformMetrics = metrics.apiCalls.byPlatform[platform];
  platformMetrics.total++;
  
  if (success) {
    platformMetrics.success++;
  } else {
    platformMetrics.failure++;
  }
  
  // Update endpoint-specific metrics
  if (!platformMetrics.byEndpoint[endpoint]) {
    platformMetrics.byEndpoint[endpoint] = {
      total: 0,
      success: 0,
      failure: 0
    };
  }
  
  const endpointMetrics = platformMetrics.byEndpoint[endpoint];
  endpointMetrics.total++;
  
  if (success) {
    endpointMetrics.success++;
  } else {
    endpointMetrics.failure++;
  }
  
  // Update response time metrics
  if (responseTime) {
    // Calculate new average response time
    const totalResponseTime = metrics.responseTimes.average * (metrics.apiCalls.total - 1);
    metrics.responseTimes.average = (totalResponseTime + responseTime) / metrics.apiCalls.total;
    
    // Update platform-specific response time
    if (!metrics.responseTimes.byPlatform[platform]) {
      metrics.responseTimes.byPlatform[platform] = {
        average: 0,
        byEndpoint: {}
      };
    }
    
    const platformResponseTimes = metrics.responseTimes.byPlatform[platform];
    const platformTotalCalls = platformMetrics.total;
    const platformTotalResponseTime = platformResponseTimes.average * (platformTotalCalls - 1);
    platformResponseTimes.average = (platformTotalResponseTime + responseTime) / platformTotalCalls;
    
    // Update endpoint-specific response time
    if (!platformResponseTimes.byEndpoint[endpoint]) {
      platformResponseTimes.byEndpoint[endpoint] = {
        average: 0
      };
    }
    
    const endpointResponseTimes = platformResponseTimes.byEndpoint[endpoint];
    const endpointTotalCalls = endpointMetrics.total;
    const endpointTotalResponseTime = endpointResponseTimes.average * (endpointTotalCalls - 1);
    endpointResponseTimes.average = (endpointTotalResponseTime + responseTime) / endpointTotalCalls;
  }
  
  // Track errors
  if (!success && error) {
    const errorType = error.name || 'Unknown';
    
    // Update error type metrics
    if (!metrics.errors.byType[errorType]) {
      metrics.errors.byType[errorType] = 0;
    }
    
    metrics.errors.byType[errorType]++;
    
    // Update platform-specific error metrics
    if (!metrics.errors.byPlatform[platform]) {
      metrics.errors.byPlatform[platform] = {
        total: 0,
        byType: {}
      };
    }
    
    const platformErrors = metrics.errors.byPlatform[platform];
    platformErrors.total++;
    
    if (!platformErrors.byType[errorType]) {
      platformErrors.byType[errorType] = 0;
    }
    
    platformErrors.byType[errorType]++;
  }
}

/**
 * Track rate limit information
 * @param {string} platform - Platform name
 * @param {number} remaining - Remaining API calls
 * @param {number} resetTime - Time when the rate limit resets (timestamp)
 */
export function trackRateLimit(platform, remaining, resetTime) {
  metrics.rateLimit.remaining[platform] = remaining;
  metrics.rateLimit.resetTime[platform] = resetTime;
}

/**
 * Track webhook event
 * @param {string} platform - Platform name
 * @param {string} eventType - Event type
 * @param {boolean} success - Whether the event was processed successfully
 */
export function trackWebhookEvent(platform, eventType, success) {
  // Update total metrics
  metrics.webhooks.received++;
  
  if (success) {
    metrics.webhooks.processed++;
  } else {
    metrics.webhooks.failed++;
  }
  
  // Update platform-specific metrics
  if (!metrics.webhooks.byPlatform[platform]) {
    metrics.webhooks.byPlatform[platform] = {
      received: 0,
      processed: 0,
      failed: 0,
      byEventType: {}
    };
  }
  
  const platformMetrics = metrics.webhooks.byPlatform[platform];
  platformMetrics.received++;
  
  if (success) {
    platformMetrics.processed++;
  } else {
    platformMetrics.failed++;
  }
  
  // Update event type-specific metrics
  if (!platformMetrics.byEventType[eventType]) {
    platformMetrics.byEventType[eventType] = {
      received: 0,
      processed: 0,
      failed: 0
    };
  }
  
  const eventTypeMetrics = platformMetrics.byEventType[eventType];
  eventTypeMetrics.received++;
  
  if (success) {
    eventTypeMetrics.processed++;
  } else {
    eventTypeMetrics.failed++;
  }
}

/**
 * Perform a health check on all integrations
 * @returns {Promise<Object>} Health check results
 */
export async function performHealthCheck() {
  const integrations = bookingIntegrationManager.getAllIntegrations();
  const results = {};
  
  for (const [platform, integration] of Object.entries(integrations)) {
    try {
      const startTime = Date.now();
      const isHealthy = await integration.testConnection();
      const responseTime = Date.now() - startTime;
      
      results[platform] = {
        status: isHealthy ? 'healthy' : 'unhealthy',
        responseTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      results[platform] = {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  // Update health check metrics
  metrics.lastHealthCheck.timestamp = new Date().toISOString();
  metrics.lastHealthCheck.status = Object.fromEntries(
    Object.entries(results).map(([platform, result]) => [platform, result.status])
  );
  metrics.lastHealthCheck.details = results;
  
  return results;
}

/**
 * Get current metrics
 * @returns {Object} Current metrics
 */
export function getMetrics() {
  return {
    ...metrics,
    timestamp: new Date().toISOString()
  };
}

/**
 * Reset metrics
 */
export function resetMetrics() {
  metrics.apiCalls = {
    total: 0,
    success: 0,
    failure: 0,
    byPlatform: {}
  };
  
  metrics.responseTimes = {
    average: 0,
    byPlatform: {}
  };
  
  metrics.errors = {
    byType: {},
    byPlatform: {}
  };
  
  metrics.webhooks = {
    received: 0,
    processed: 0,
    failed: 0,
    byPlatform: {}
  };
}

/**
 * Schedule regular health checks
 * @param {number} interval - Interval in milliseconds
 * @returns {number} Interval ID
 */
export function scheduleHealthChecks(interval = 300000) { // Default: 5 minutes
  return setInterval(performHealthCheck, interval);
}

// Export monitoring module
export default {
  trackApiCall,
  trackRateLimit,
  trackWebhookEvent,
  performHealthCheck,
  getMetrics,
  resetMetrics,
  scheduleHealthChecks
};

