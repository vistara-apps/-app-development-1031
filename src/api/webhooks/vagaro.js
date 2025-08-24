import { processWebhookEvent } from './index';

/**
 * Process a Vagaro webhook event
 * @param {Object} event - Vagaro webhook event data
 * @returns {Promise<Object>} Processing result
 */
export async function processVagaroWebhook(event) {
  return await processWebhookEvent(event, 'vagaro');
}

/**
 * Verify Vagaro webhook signature
 * @param {Object} headers - Request headers
 * @param {string} body - Raw request body
 * @param {string} secret - Webhook secret
 * @returns {boolean} True if signature is valid
 */
export function verifyVagaroWebhookSignature(headers, body, secret) {
  // In a real implementation, this would:
  // 1. Extract the signature from headers
  // 2. Compute the expected signature using the secret
  // 3. Compare the signatures
  
  const signature = headers['x-vagaro-signature'];
  
  if (!signature) {
    return false;
  }
  
  // Mock implementation - in a real app, this would perform actual signature verification
  return true;
}

export default {
  processVagaroWebhook,
  verifyVagaroWebhookSignature
};

