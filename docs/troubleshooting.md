# Booking Integration Troubleshooting Guide

This guide provides solutions for common issues that may arise when working with the booking platform integrations.

## Authentication Issues

### OAuth2 Authentication Failures

**Symptoms:**
- "Authentication failed" errors
- Unable to initialize integration
- 401 Unauthorized responses from API

**Possible Causes:**
1. Invalid Client ID or Client Secret
2. Expired access token
3. Invalid redirect URI
4. Insufficient permissions

**Solutions:**
1. Verify Client ID and Client Secret are correct
2. Check if the access token has expired and needs to be refreshed
3. Ensure the redirect URI matches exactly what is registered with the platform
4. Verify that the OAuth scope includes all necessary permissions

```javascript
// Example of proper OAuth2 configuration
const config = {
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'https://yourdomain.com/auth/callback',
  scope: 'read write' // Make sure this includes all needed permissions
};
```

### API Key Authentication Failures

**Symptoms:**
- "Invalid API key" errors
- 403 Forbidden responses from API

**Possible Causes:**
1. Invalid API key
2. API key does not have sufficient permissions
3. API key has been revoked

**Solutions:**
1. Verify the API key is correct
2. Check the permissions associated with the API key
3. Generate a new API key if necessary

## Connection Issues

### Unable to Connect to Booking Platform

**Symptoms:**
- Timeout errors
- Network connection errors
- "Service unavailable" errors

**Possible Causes:**
1. Platform API is down
2. Network connectivity issues
3. Incorrect API endpoint

**Solutions:**
1. Check the platform's status page for any reported outages
2. Verify network connectivity
3. Ensure the correct API endpoint is being used

```javascript
// Example of checking connection
async function checkConnection() {
  try {
    await integration.testConnection();
    console.log('Connection successful');
  } catch (error) {
    console.error('Connection failed:', error.message);
    // Implement appropriate fallback
  }
}
```

### Rate Limiting Issues

**Symptoms:**
- 429 Too Many Requests errors
- Sudden failure of API calls that were working previously

**Possible Causes:**
1. Exceeded platform's rate limits
2. Too many concurrent requests

**Solutions:**
1. Implement rate limiting in your application
2. Add exponential backoff for retries
3. Cache frequently accessed data to reduce API calls

```javascript
// Example of handling rate limits
async function makeApiCallWithRetry(apiCall, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.code === 'RATE_LIMIT_ERROR' && retries < maxRetries - 1) {
        // Calculate exponential backoff
        const delay = Math.pow(2, retries) * 1000;
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        retries++;
      } else {
        throw error;
      }
    }
  }
}
```

## Data Synchronization Issues

### Webhook Events Not Being Received

**Symptoms:**
- Missing real-time updates
- Data becoming stale or out of sync

**Possible Causes:**
1. Webhook URL not properly configured in the platform
2. Webhook validation failing
3. Webhook endpoint not accessible from the internet

**Solutions:**
1. Verify webhook URL is correctly configured in the platform
2. Check webhook signature validation
3. Ensure webhook endpoint is publicly accessible
4. Implement a webhook testing tool to verify receipt of events

```javascript
// Example of webhook validation
function validateWebhook(headers, body, secret) {
  const signature = headers['x-webhook-signature'];
  const computedSignature = computeSignature(body, secret);
  
  return signature === computedSignature;
}
```

### Inconsistent Data Between Platforms

**Symptoms:**
- Different data returned from different platforms
- Unexpected data formats or values

**Possible Causes:**
1. Platform-specific data models
2. Different data validation rules
3. Timezone inconsistencies

**Solutions:**
1. Implement robust data normalization
2. Add validation for platform-specific quirks
3. Standardize timezone handling

```javascript
// Example of normalizing dates across platforms
function normalizeDate(dateString, platform) {
  const date = new Date(dateString);
  
  // Handle platform-specific timezone issues
  if (platform === 'vagaro') {
    // Vagaro returns dates in local timezone
    return new Date(date.toISOString());
  } else if (platform === 'mindbody') {
    // Mindbody returns dates in UTC
    return date;
  }
  
  return date;
}
```

## Booking Issues

### Unable to Book Appointments

**Symptoms:**
- Booking failures
- Error messages when attempting to book

**Possible Causes:**
1. Invalid appointment data
2. Time slot no longer available
3. Insufficient permissions
4. Business rules preventing booking

**Solutions:**
1. Validate all appointment data before submission
2. Check availability immediately before booking
3. Verify booking permissions
4. Check for platform-specific booking rules

```javascript
// Example of pre-booking validation
async function validateBeforeBooking(appointmentDetails) {
  // Check if the time slot is still available
  const isAvailable = await availabilityService.isTimeSlotAvailable(
    appointmentDetails.startTime,
    { 
      serviceId: appointmentDetails.serviceId,
      providerId: appointmentDetails.providerId
    }
  );
  
  if (!isAvailable) {
    throw new Error('This time slot is no longer available');
  }
  
  // Validate other appointment details
  if (!appointmentDetails.customerId) {
    throw new Error('Customer ID is required');
  }
  
  // Additional validation...
  
  return true;
}
```

### Double Bookings

**Symptoms:**
- Same appointment booked twice
- Overlapping appointments

**Possible Causes:**
1. Race conditions in booking process
2. Webhook processing delays
3. Duplicate API calls

**Solutions:**
1. Implement idempotent booking requests
2. Add booking reference IDs to detect duplicates
3. Implement a booking lock mechanism

```javascript
// Example of idempotent booking
async function idempotentBooking(appointmentDetails, idempotencyKey) {
  // Check if we've already processed this booking request
  const existingBooking = await getBookingByIdempotencyKey(idempotencyKey);
  
  if (existingBooking) {
    return existingBooking;
  }
  
  // Proceed with booking
  const booking = await integration.bookAppointment(appointmentDetails);
  
  // Store the idempotency key with the booking
  await storeBookingIdempotencyKey(booking.id, idempotencyKey);
  
  return booking;
}
```

## Platform-Specific Issues

### Vagaro-Specific Issues

**Issue: Service Categories Not Appearing**

**Solution:** Vagaro requires explicit requests for service categories. Use the `/services/categories` endpoint before requesting services.

**Issue: Staff Availability Inconsistencies**

**Solution:** Vagaro's availability endpoint may not account for all types of time off. Cross-check with the staff member's calendar.

### Mindbody-Specific Issues

**Issue: Site ID Confusion**

**Solution:** Ensure you're using the correct Site ID for multi-location businesses. Each location may have a different Site ID.

**Issue: Session Expiration**

**Solution:** Mindbody API sessions may expire more quickly than indicated. Implement proactive token refresh.

### Phorest-Specific Issues

**Issue: Branch ID Required for Most Endpoints**

**Solution:** Almost all Phorest endpoints require both Business ID and Branch ID. Ensure both are included in requests.

**Issue: Webhook Delivery Delays**

**Solution:** Phorest webhooks may experience delays during high traffic periods. Implement a polling fallback for time-sensitive operations.

## General Troubleshooting Steps

1. **Check Logs:** Review application logs for error messages and API responses
2. **Verify Configuration:** Ensure all API credentials and endpoints are correctly configured
3. **Test API Directly:** Use a tool like Postman to test API endpoints directly
4. **Check Platform Status:** Verify the booking platform's service status
5. **Review Documentation:** Check for recent changes in the platform's API documentation
6. **Contact Support:** Reach out to the platform's developer support if issues persist

## Monitoring and Alerting

Implement monitoring and alerting for:

1. **Authentication Failures:** Alert on repeated authentication failures
2. **API Errors:** Monitor for increased error rates
3. **Webhook Delivery:** Alert on missed webhook events
4. **Rate Limit Approaches:** Warn when approaching rate limits
5. **Integration Health:** Regular health checks for each integration

## Fallback Strategies

When integrations fail, implement these fallback strategies:

1. **Cached Data:** Use cached data when API is unavailable
2. **Polling Fallback:** Fall back to polling when webhooks fail
3. **Manual Override:** Provide manual booking options when automated booking fails
4. **Notification System:** Alert users of integration issues with clear next steps

