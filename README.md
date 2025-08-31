# FastFlow - Personalized Intermittent Fasting App

FastFlow is a minimalist app that creates personalized intermittent fasting plans using AI. It helps users track their fasting progress, provides personalized recommendations, and adapts to their feedback.

## Features

- **User Onboarding**: Collect basic user information (age, gender, weight, goals, sleep/wake times)
- **AI-Generated Fasting Plans**: Personalized fasting schedules based on user input (14:10, 16:8, OMAD)
- **Visual Fasting Timer**: Track fasting progress with real-time status
- **Daily Check-ins**: AI adjusts fasting plans based on user feedback
- **Progress Tracking**: View fasting history, mood trends, and weekly statistics
- **Voice Journal**: Record thoughts about fasting experience (premium feature)
- **Clean, Minimal UI**: Soft colors and simple typography

## Tech Stack

- **Frontend**: React with Material-UI (MUI)
- **Backend**: Firebase (Authentication, Firestore, Storage, Functions)
- **AI Integration**: OpenAI API for personalized plans and voice transcription
- **Additional Libraries**: Chart.js, date-fns, react-speech-recognition

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fastflow.git
   cd fastflow
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

4. Start the development server:
   ```
   npm start
   ```

### Firebase Setup

1. Create a new Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Set up Firebase Storage
5. Add your web app to the Firebase project to get the configuration values

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/         # React context providers
├── pages/            # Application pages
│   ├── auth/         # Authentication pages
│   └── onboarding/   # Onboarding flow pages
├── services/         # Firebase and API services
├── styles/           # Global styles and theme
├── utils/            # Utility functions
├── App.jsx           # Main application component
├── firebase.js       # Firebase configuration
└── index.js          # Entry point
```

## Subscription Tiers

### Free Tier
- Basic fasting timer
- Daily check-ins
- Basic statistics

### Premium Tier
- All free features
- Voice journaling
- Advanced analytics
- Weekly fasting score
- Custom fasting protocols
- Data export

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Material-UI](https://mui.com/)
- [Firebase](https://firebase.google.com/)
- [OpenAI](https://openai.com/)
- [Chart.js](https://www.chartjs.org/)
- [date-fns](https://date-fns.org/)

