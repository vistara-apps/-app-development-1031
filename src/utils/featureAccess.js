import { SUBSCRIPTION_TIERS } from '../services/subscription';

// Feature access map
const FEATURE_ACCESS = {
  [SUBSCRIPTION_TIERS.FREE]: {
    basicFasting: true,
    dailyCheckIn: true,
    basicStats: true,
    voiceJournal: false,
    advancedAnalytics: false,
    weeklyFastingScore: false,
    customProtocols: false,
    exportData: false
  },
  [SUBSCRIPTION_TIERS.PREMIUM]: {
    basicFasting: true,
    dailyCheckIn: true,
    basicStats: true,
    voiceJournal: true,
    advancedAnalytics: true,
    weeklyFastingScore: true,
    customProtocols: true,
    exportData: true
  }
};

// Check if a feature is available for a subscription tier
export const isFeatureAvailable = (tier, feature) => {
  if (!tier || !feature) return false;
  
  const tierFeatures = FEATURE_ACCESS[tier];
  
  if (!tierFeatures) return false;
  
  return tierFeatures[feature] || false;
};

// Get feature comparison for subscription tiers
export const getFeatureComparison = () => {
  return [
    {
      feature: 'Basic Fasting Timer',
      free: 'Yes',
      premium: 'Yes'
    },
    {
      feature: 'Daily Check-in',
      free: 'Yes',
      premium: 'Yes'
    },
    {
      feature: 'Basic Statistics',
      free: 'Yes',
      premium: 'Yes'
    },
    {
      feature: 'Voice Journal',
      free: 'No',
      premium: 'Yes'
    },
    {
      feature: 'Advanced Analytics',
      free: 'No',
      premium: 'Yes'
    },
    {
      feature: 'Weekly Fasting Score',
      free: 'No',
      premium: 'Yes'
    },
    {
      feature: 'Custom Fasting Protocols',
      free: 'No',
      premium: 'Yes'
    },
    {
      feature: 'Export Data',
      free: 'No',
      premium: 'Yes'
    }
  ];
};

