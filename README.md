# TechBuddy - Senior Tech Support Application

TechBuddy is a React-based web application designed to help seniors navigate and configure technology with easy-to-follow guides and accessibility features.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Development](#development)
  - [Available Scripts](#available-scripts)
  - [Testing](#testing)
- [Deployment](#deployment)
- [Component Documentation](#component-documentation)
  - [Navigation](#navigation)
  - [Pages](#pages)
- [Theme Configuration](#theme-configuration)

## Overview

TechBuddy provides a user-friendly interface with accessibility features specifically designed for seniors. The application includes guided device setup wizards and customizable accessibility settings to make technology more approachable for elderly users.

## Project Structure

```
techbuddy/
├── Dockerfile           # Docker configuration for containerization
├── index.html           # Main HTML entry point
├── package.json         # Project dependencies and scripts
├── src/                 # Source code directory
│   ├── App.jsx          # Main application component
│   ├── components/      # Reusable UI components
│   │   └── Navigation.jsx  # Navigation bar component
│   ├── main.jsx         # Application entry point
│   └── pages/           # Page components
│       ├── AppConfigPage.jsx    # Accessibility settings page
│       ├── DeviceSetupPage.jsx  # Device setup wizard page
│       └── HomePage.jsx         # Landing page
└── vite.config.js       # Vite configuration
```

## Features

- **Home Page**: Overview of available services and features
- **Device Setup Wizard**: Step-by-step guide for setting up new devices
- **Accessibility Configuration**: Customizable settings for font size and contrast

## Technology Stack

- **Frontend Framework**: React 18
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Testing**: Vitest
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd techbuddy
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run test` - Run tests
- `npm run lint` - Run ESLint to check for code quality issues

### Testing

Tests are written using Vitest. Run the test suite with:

```bash
npm run test
```

## Deployment

The application can be deployed using Docker:

1. Build the Docker image:
   ```bash
   docker build -t techbuddy .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 techbuddy
   ```

The application will be available at http://localhost:3000

## Component Documentation

### Navigation

The `Navigation` component (`src/components/Navigation.jsx`) provides the main navigation bar for the application. It includes links to all main pages:

- Home
- Device Setup
- App Configuration

### Pages

#### HomePage (`src/pages/HomePage.jsx`)

The landing page that introduces users to the application's main features:
- Guided Device Setup
- App Configuration

#### DeviceSetupPage (`src/pages/DeviceSetupPage.jsx`)

A step-by-step wizard for setting up new devices with the following steps:
1. Choose Your Device
2. Basic Configuration
3. Connectivity Setup
4. Personalization

The wizard uses Material-UI's Stepper component to guide users through the setup process.

#### AppConfigPage (`src/pages/AppConfigPage.jsx`)

Allows users to customize accessibility settings:
- Font Size: Adjustable slider (12px to 24px)
- High Contrast Mode: Toggle switch

## Theme Configuration

The application uses a custom Material-UI theme defined in `src/main.jsx`:

- **Primary Color**: #3F51B5 (Accessible blue)
- **Secondary Color**: #F50057
- **Font Family**: Arial, sans-serif
- **Base Font Size**: 16px

The theme is applied using MUI's ThemeProvider component to ensure consistent styling throughout the application.

