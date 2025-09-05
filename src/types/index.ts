// Core data model types based on specifications

export interface User {
  user_id: string;
  farcaster_fid?: string;
  phone_number?: string;
  emergency_contacts: string[];
  preferred_language: 'en' | 'es';
  current_state: string;
  created_at: string;
  updated_at: string;
}

export interface LegalGuide {
  guide_id: string;
  state: string;
  title: string;
  content: string;
  language: 'en' | 'es';
  created_at: string;
  updated_at: string;
}

export interface Script {
  script_id: string;
  state: string;
  situation: string;
  dialogue_type: 'user_response' | 'officer_script';
  text: string;
  language: 'en' | 'es';
  order_in_sequence: number;
  created_at: string;
  updated_at: string;
}

export interface IncidentReport {
  report_id: string;
  user_id: string;
  timestamp: string;
  location: {
    lat: number;
    lon: number;
  };
  recording_url?: string;
  generated_card_url?: string;
  created_at: string;
}

// UI Component Types
export interface ComponentVariants {
  default?: string;
  compact?: string;
  primary?: string;
  secondary?: string;
  emergency?: string;
  start?: string;
  stop?: string;
  idle?: string;
  show?: string;
  hide?: string;
  normal?: string;
  mobile?: string;
  dropdown?: string;
  search?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Recording State Types
export interface RecordingState {
  isRecording: boolean;
  startTime?: Date;
  duration: number;
  recordingUrl?: string;
}

// Location Types
export interface LocationData {
  lat: number;
  lon: number;
  address?: string;
  state?: string;
}

// AI Generation Types
export interface AIGenerationRequest {
  prompt: string;
  context?: {
    state?: string;
    situation?: string;
    language?: 'en' | 'es';
  };
}

export interface ShareableCard {
  id: string;
  title: string;
  content: string;
  location: LocationData;
  timestamp: string;
  ipfsUrl?: string;
  arweaveUrl?: string;
}

// US States enum
export const US_STATES = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
} as const;

export type StateCode = keyof typeof US_STATES;
