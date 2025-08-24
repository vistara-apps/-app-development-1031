import { processWebhookEvent } from './index';

/**
 * Process a Mindbody webhook event
 * @param {Object} event - Mindbody webhook event data
 * @returns {Promise<Object>} Processing result
 */
export async function processMindbodyWebhook(event) {
  return await processWebhookEvent(event, 'mindbody');
}

/**
 * Verify Mindbody webhook signature
 * @param {Object} headers - Request headers
 * @param {string} body - Raw request body
 * @param {string} secret - Webhook secret
 * @returns {boolean} True if signature is valid
 */
export function verifyMindbodyWebhookSignature(headers, body, secret) {
  // In a real implementation, this would:
  // 1. Extract the signature from headers
  // 2. Compute the expected signature using the secret
  // 3. Compare the signatures
  
  const signature = headers['x-mindbody-signature'];
  
  if (!signature) {
    return false;
  }
  
  // Mock implementation - in a real app, this would perform actual signature verification
  return true;
}

export default {
  processMindbodyWebhook,
  verifyMindbodyWebhookSignature
};

