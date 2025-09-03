# FurryFrame

Your Farcaster frame for crafting and sharing purrfect cat moments.

## Overview

FurryFrame is a Farcaster frame application that allows users to create, enhance, and participate in themed photo challenges featuring their cats. The app leverages AI-powered photo enhancement, themed challenges, and a micro-transaction system for virtual treat gifting.

## Features

### AI Photo Enhancement

Upload a cat photo and apply AI-powered filters to automatically improve lighting, sharpness, and color. Users can choose from a selection of free basic filters or opt for premium filters.

### Themed Photo Challenges

Participate in weekly or daily themed photo challenges (e.g., 'Cats in Boxes', 'Sleepy Kitties'). Users can submit their enhanced photos to the challenge within the Farcaster frame.

### Virtual Treat Gifting

Users can send small 'virtual treats' (e.g., custom emoji stickers like a fish or a ball of yarn) to their favorite submitted photos within a challenge. Gifting requires a small micro-transaction.

## Business Model

FurryFrame uses a micro-transaction model:
- Optional premium AI enhancement filters ($0.25/photo)
- Virtual treat gifting ($0.10/treat)

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Authentication**: Privy (for Farcaster authentication and wallet connection)
- **Blockchain**: Base L2 (for micro-transactions)
- **Storage**: IPFS via Pinata (for storing photos)
- **APIs**: Farcaster (Neynar), OpenAI (for image enhancement)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/furryframe.git
cd furryframe
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/src/app`: Next.js app router pages and API routes
- `/src/components`: React components
- `/src/lib`: Library code, including authentication and state management
- `/src/hooks`: Custom React hooks
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions
- `/src/styles`: Global styles and Tailwind configuration

## API Endpoints

- `/api/photos/upload`: Upload a new photo
- `/api/photos/enhance`: Apply AI enhancement to a photo
- `/api/challenges/active`: Get active challenges
- `/api/challenges/[id]/submissions`: Get submissions for a challenge
- `/api/gifts/send`: Send a virtual treat gift
- `/api/gifts/photo/[id]`: Get gifts for a photo
- `/api/users/[id]`: Get user profile
- `/api/auth/verify`: Verify Farcaster user

## License

This project is licensed under the MIT License - see the LICENSE file for details.

