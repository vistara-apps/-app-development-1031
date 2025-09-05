# LegalShield AI

Navigate legal encounters with confidence. Your rights, in your pocket.

## Overview

LegalShield AI is a Base Mini App that provides instant, mobile-optimized legal rights guides and scripted responses for citizens interacting with law enforcement. The app empowers users with critical legal knowledge and ensures they know their rights during police encounters.

## Features

### 🛡️ State-Specific Rights Guides
- One-page, mobile-optimized summaries of key legal rights
- Tailored to specific US states and relevant laws
- Easy to read and understand during stressful situations
- Available in English and Spanish

### 💬 Scripted Responses
- Pre-written, effective phrases for common police interactions
- Designed for clarity and de-escalation
- Covers scenarios like traffic stops, searches, and arrests
- Bilingual support (English/Spanish)

### 🚨 One-Tap Recording & Alerting
- Instant audio recording of interactions
- Automatic emergency contact alerts with location data
- Discreet operation for user safety
- Evidence preservation for legal documentation

### 📋 Automated Incident Summaries
- AI-generated shareable cards with incident details
- Current location and relevant state-specific rights
- Permanent storage on IPFS for tamper-proof documentation
- Easy sharing with legal counsel or support networks

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **State Management**: Zustand with persistence
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4 for content generation
- **Storage**: Pinata for IPFS pinning
- **Animations**: Framer Motion
- **UI Components**: Custom component library
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- OpenAI API key
- Pinata account for IPFS storage

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd legalshield-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `OPENAI_API_KEY`: Your OpenAI API key
- `PINATA_API_KEY`: Your Pinata API key
- `PINATA_SECRET_API_KEY`: Your Pinata secret API key

4. Set up the database:

Create the following tables in your Supabase project:

```sql
-- Users table
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farcaster_fid TEXT,
  phone_number TEXT,
  emergency_contacts JSONB DEFAULT '[]',
  preferred_language TEXT DEFAULT 'en',
  current_state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal guides table
CREATE TABLE legal_guides (
  guide_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scripts table
CREATE TABLE scripts (
  script_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL,
  situation TEXT NOT NULL,
  dialogue_type TEXT NOT NULL,
  text TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  order_in_sequence INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incident reports table
CREATE TABLE incident_reports (
  report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  location JSONB NOT NULL,
  recording_url TEXT,
  generated_card_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_legal_guides_state_language ON legal_guides(state, language);
CREATE INDEX idx_scripts_state_situation ON scripts(state, situation);
CREATE INDEX idx_incident_reports_user_id ON incident_reports(user_id);
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── onboarding/        # Onboarding flow
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── legal/            # Legal-specific components
│   └── recording/        # Recording components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── store/                # Zustand store
└── types/                # TypeScript type definitions
```

## Key Components

### State Management
- **Zustand Store**: Manages user preferences, location, recording state
- **Persistence**: User data persisted to localStorage
- **Selectors**: Optimized state access patterns

### Recording System
- **useRecording Hook**: Manages audio recording with MediaRecorder API
- **Emergency Alerts**: Automatic contact notification system
- **Location Integration**: GPS coordinates with reverse geocoding

### AI Integration
- **Legal Guide Generation**: State-specific rights information
- **Script Generation**: Contextual dialogue for police interactions
- **Incident Summaries**: AI-powered documentation

### IPFS Storage
- **Pinata Integration**: Decentralized storage for incident cards
- **Permanent Documentation**: Tamper-proof evidence preservation
- **Shareable Links**: Easy distribution of incident reports

## API Endpoints

### Legal Guides
- `GET /api/guides?state=CA&language=en` - Fetch legal guides
- `POST /api/guides` - Generate new legal guide

### Scripts
- `GET /api/scripts?state=CA&situation=traffic_stop` - Fetch scripts
- `POST /api/scripts` - Generate new scripts

### Incidents
- `POST /api/incidents` - Create incident report
- `GET /api/incidents?user_id=123` - Fetch user incidents

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Security Considerations

- **Data Privacy**: Minimal personal data collection
- **Encrypted Storage**: Sensitive data encrypted in Supabase
- **IPFS Security**: Incident cards stored on decentralized network
- **API Security**: Rate limiting and input validation
- **Recording Permissions**: Explicit user consent required

## Legal Disclaimer

This application provides general legal information and should not replace professional legal advice. Users should:

- Always comply with lawful orders from law enforcement
- Prioritize personal safety in all interactions
- Consult with qualified legal counsel for specific situations
- Understand that laws vary by jurisdiction and change over time

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

## Acknowledgments

- Built for the Base ecosystem
- Powered by OpenAI for AI-generated content
- Uses Supabase for backend infrastructure
- IPFS storage via Pinata
- UI components inspired by modern design systems
