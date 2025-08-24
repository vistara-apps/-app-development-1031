/**
 * Messaging Service
 * Handles automated, personalized messaging workflow for post-appointment follow-ups
 */

// Sample appointment data - in a real app, this would come from a database
const sampleAppointments = [
  {
    id: 1,
    userId: 101,
    deviceType: 'Smartphone',
    appointmentDate: '2025-08-20T14:00:00',
    status: 'completed',
    notes: 'Helped with basic smartphone setup and app installation'
  },
  {
    id: 2,
    userId: 102,
    deviceType: 'Tablet',
    appointmentDate: '2025-08-22T10:30:00',
    status: 'completed',
    notes: 'Configured email and showed how to use video calling'
  }
];

// Sample user data - in a real app, this would come from a database
const sampleUsers = [
  {
    id: 101,
    name: 'Martha Johnson',
    email: 'martha.j@example.com',
    phone: '555-123-4567',
    preferredContactMethod: 'email'
  },
  {
    id: 102,
    name: 'Robert Williams',
    email: 'robert.w@example.com',
    phone: '555-987-6543',
    preferredContactMethod: 'sms'
  }
];

// Message templates for different scenarios
const messageTemplates = {
  followUp: {
    email: {
      subject: 'How is your new {deviceType} working for you?',
      body: 'Hello {name},\n\nThank you for your recent appointment with TechBuddy. We hope you\'re enjoying your {deviceType}! How has your experience been so far? If you have any questions about what we covered during our session, please don\'t hesitate to reply to this email.\n\nBest regards,\nThe TechBuddy Team'
    },
    sms: 'Hi {name}, it\'s TechBuddy! How is your {deviceType} working for you since our appointment? Reply with any questions you might have.'
  },
  reminder: {
    email: {
      subject: 'Quick Reminder of What We Covered',
      body: 'Hello {name},\n\nJust a friendly reminder of what we covered in our recent TechBuddy session:\n\n{notes}\n\nDon\'t forget to practice these skills to build your confidence. We\'re here if you need any further assistance!\n\nBest regards,\nThe TechBuddy Team'
    },
    sms: 'TechBuddy reminder: We covered {deviceType} basics in our session. Remember to practice! Need help? Just text back.'
  },
  tip: {
    email: {
      subject: 'A Helpful Tip for Your {deviceType}',
      body: 'Hello {name},\n\nHere\'s a quick tip for your {deviceType} that you might find useful:\n\n{tipContent}\n\nWe hope this helps enhance your experience!\n\nBest regards,\nThe TechBuddy Team'
    },
    sms: 'TechBuddy tip: {tipContent} Hope this helps with your {deviceType}! Questions? Text us back.'
  }
};

// Tips based on device type
const deviceTips = {
  Smartphone: [
    'To save battery life, try reducing your screen brightness or enabling battery saver mode.',
    'Double-tap the space bar when typing to automatically add a period and space.',
    'Use the Do Not Disturb mode at night to silence notifications while you sleep.'
  ],
  Tablet: [
    'Try using split-screen mode to view two apps at once - great for referencing information.',
    'Adjust the text size in your settings for more comfortable reading.',
    'Most tablets can connect to external keyboards for easier typing.'
  ],
  Computer: [
    'Press Ctrl+Z (or Command+Z on Mac) to undo your last action in most programs.',
    'Regularly restart your computer to keep it running smoothly.',
    'Use keyboard shortcuts like Ctrl+C (copy) and Ctrl+V (paste) to work more efficiently.'
  ]
};

/**
 * Get a random tip for a specific device type
 * @param {string} deviceType - The type of device
 * @returns {string} A random tip for the device
 */
const getRandomTip = (deviceType) => {
  const tips = deviceTips[deviceType] || deviceTips.Smartphone;
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
};

/**
 * Format a message by replacing placeholders with actual values
 * @param {string} template - The message template with placeholders
 * @param {Object} data - The data to replace placeholders with
 * @returns {string} The formatted message
 */
const formatMessage = (template, data) => {
  let formattedMessage = template;
  
  Object.keys(data).forEach(key => {
    const placeholder = new RegExp(`{${key}}`, 'g');
    formattedMessage = formattedMessage.replace(placeholder, data[key]);
  });
  
  return formattedMessage;
};

/**
 * Generate a follow-up message for a completed appointment
 * @param {Object} appointment - The appointment data
 * @param {Object} user - The user data
 * @returns {Object} The generated message
 */
const generateFollowUpMessage = (appointment, user) => {
  const messageType = 'followUp';
  const contactMethod = user.preferredContactMethod;
  
  let messageData = {
    name: user.name,
    deviceType: appointment.deviceType,
    notes: appointment.notes
  };
  
  if (contactMethod === 'email') {
    return {
      to: user.email,
      method: 'email',
      subject: formatMessage(messageTemplates[messageType].email.subject, messageData),
      body: formatMessage(messageTemplates[messageType].email.body, messageData)
    };
  } else {
    return {
      to: user.phone,
      method: 'sms',
      body: formatMessage(messageTemplates[messageType].sms, messageData)
    };
  }
};

/**
 * Generate a reminder message with session details
 * @param {Object} appointment - The appointment data
 * @param {Object} user - The user data
 * @returns {Object} The generated message
 */
const generateReminderMessage = (appointment, user) => {
  const messageType = 'reminder';
  const contactMethod = user.preferredContactMethod;
  
  let messageData = {
    name: user.name,
    deviceType: appointment.deviceType,
    notes: appointment.notes
  };
  
  if (contactMethod === 'email') {
    return {
      to: user.email,
      method: 'email',
      subject: formatMessage(messageTemplates[messageType].email.subject, messageData),
      body: formatMessage(messageTemplates[messageType].email.body, messageData)
    };
  } else {
    return {
      to: user.phone,
      method: 'sms',
      body: formatMessage(messageTemplates[messageType].sms, messageData)
    };
  }
};

/**
 * Generate a tip message for a specific device
 * @param {Object} appointment - The appointment data
 * @param {Object} user - The user data
 * @returns {Object} The generated message
 */
const generateTipMessage = (appointment, user) => {
  const messageType = 'tip';
  const contactMethod = user.preferredContactMethod;
  
  let messageData = {
    name: user.name,
    deviceType: appointment.deviceType,
    tipContent: getRandomTip(appointment.deviceType)
  };
  
  if (contactMethod === 'email') {
    return {
      to: user.email,
      method: 'email',
      subject: formatMessage(messageTemplates[messageType].email.subject, messageData),
      body: formatMessage(messageTemplates[messageType].email.body, messageData)
    };
  } else {
    return {
      to: user.phone,
      method: 'sms',
      body: formatMessage(messageTemplates[messageType].sms, messageData)
    };
  }
};

/**
 * Send a message (mock implementation)
 * @param {Object} message - The message to send
 * @returns {Promise} A promise that resolves when the message is sent
 */
const sendMessage = async (message) => {
  // In a real application, this would connect to an email or SMS API
  console.log(`Sending ${message.method} to ${message.to}`);
  console.log(message.method === 'email' ? `Subject: ${message.subject}` : '');
  console.log(`Body: ${message.body}`);
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, messageId: Math.random().toString(36).substring(2, 15) });
    }, 1000);
  });
};

/**
 * Schedule a message to be sent at a specific time
 * @param {Object} message - The message to send
 * @param {Date} scheduledTime - When to send the message
 * @returns {Object} The scheduled message information
 */
const scheduleMessage = (message, scheduledTime) => {
  // In a real application, this would use a job queue or scheduler
  const scheduledId = Math.random().toString(36).substring(2, 15);
  
  console.log(`Message scheduled for ${scheduledTime.toISOString()}`);
  
  // For demo purposes, we'll just return the scheduled info
  return {
    scheduledId,
    message,
    scheduledTime
  };
};

/**
 * Generate and schedule follow-up messages for a completed appointment
 * @param {number} appointmentId - The ID of the completed appointment
 * @returns {Promise<Array>} A promise that resolves to an array of scheduled messages
 */
const scheduleFollowUpSequence = async (appointmentId) => {
  // In a real app, we would fetch this data from a database
  const appointment = sampleAppointments.find(a => a.id === appointmentId);
  if (!appointment || appointment.status !== 'completed') {
    throw new Error('Appointment not found or not completed');
  }
  
  const user = sampleUsers.find(u => u.id === appointment.userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Calculate scheduled times based on appointment date
  const appointmentDate = new Date(appointment.appointmentDate);
  
  // Schedule follow-up message for 1 day after appointment
  const followUpDate = new Date(appointmentDate);
  followUpDate.setDate(followUpDate.getDate() + 1);
  
  // Schedule reminder message for 3 days after appointment
  const reminderDate = new Date(appointmentDate);
  reminderDate.setDate(reminderDate.getDate() + 3);
  
  // Schedule tip message for 7 days after appointment
  const tipDate = new Date(appointmentDate);
  tipDate.setDate(tipDate.getDate() + 7);
  
  // Generate messages
  const followUpMessage = generateFollowUpMessage(appointment, user);
  const reminderMessage = generateReminderMessage(appointment, user);
  const tipMessage = generateTipMessage(appointment, user);
  
  // Schedule messages
  const scheduledMessages = [
    scheduleMessage(followUpMessage, followUpDate),
    scheduleMessage(reminderMessage, reminderDate),
    scheduleMessage(tipMessage, tipDate)
  ];
  
  return scheduledMessages;
};

/**
 * Get all appointments for a user
 * @param {number} userId - The user ID
 * @returns {Array} The user's appointments
 */
const getUserAppointments = (userId) => {
  // In a real app, we would fetch this from a database
  return sampleAppointments.filter(appointment => appointment.userId === userId);
};

/**
 * Get all scheduled messages for a user
 * @param {number} userId - The user ID
 * @returns {Array} The scheduled messages for the user
 */
const getScheduledMessagesForUser = async (userId) => {
  // This is a mock implementation
  // In a real app, we would fetch this from a database
  
  // Get user's appointments
  const userAppointments = getUserAppointments(userId);
  
  // For demo purposes, we'll generate scheduled messages for each appointment
  let scheduledMessages = [];
  
  for (const appointment of userAppointments) {
    if (appointment.status === 'completed') {
      try {
        const messages = await scheduleFollowUpSequence(appointment.id);
        scheduledMessages = [...scheduledMessages, ...messages];
      } catch (error) {
        console.error(`Error scheduling messages for appointment ${appointment.id}:`, error);
      }
    }
  }
  
  return scheduledMessages;
};

export {
  generateFollowUpMessage,
  generateReminderMessage,
  generateTipMessage,
  sendMessage,
  scheduleMessage,
  scheduleFollowUpSequence,
  getUserAppointments,
  getScheduledMessagesForUser,
  // Export sample data for demo purposes
  sampleAppointments,
  sampleUsers
};

