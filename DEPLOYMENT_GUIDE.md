# TechBuddy Deployment Guide

This document provides detailed instructions for deploying the TechBuddy application in various environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development Deployment](#local-development-deployment)
- [Production Deployment](#production-deployment)
  - [Building for Production](#building-for-production)
  - [Docker Deployment](#docker-deployment)
  - [Static Hosting Deployment](#static-hosting-deployment)
- [Environment Configuration](#environment-configuration)
- [Continuous Integration/Continuous Deployment](#continuous-integrationcontinuous-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying TechBuddy, ensure you have the following:

- Node.js (v14 or higher)
- npm or yarn
- Docker (for containerized deployment)
- Git

## Local Development Deployment

For local development, follow these steps:

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

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Access the application at http://localhost:3000

The development server includes:
- Hot module replacement for instant updates
- Error overlay for debugging
- Source maps for easier debugging

## Production Deployment

### Building for Production

To build the application for production:

1. Create an optimized production build:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. The build artifacts will be stored in the `dist/` directory.

3. Preview the production build locally:
   ```bash
   npm run preview
   # or
   yarn preview
   ```

### Docker Deployment

TechBuddy can be deployed using Docker:

1. Build the Docker image:
   ```bash
   docker build -t techbuddy .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 techbuddy
   ```

3. Access the application at http://localhost:3000

#### Docker Compose (Optional)

For more complex deployments, you can use Docker Compose:

1. Create a `docker-compose.yml` file:
   ```yaml
   version: '3'
   services:
     techbuddy:
       build: .
       ports:
         - "3000:3000"
       restart: unless-stopped
   ```

2. Start the services:
   ```bash
   docker-compose up -d
   ```

### Static Hosting Deployment

Since TechBuddy is a static single-page application, it can be deployed to any static hosting service:

#### Deploying to Netlify

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Deploy to Netlify:
   ```bash
   netlify deploy
   ```

4. Follow the prompts to complete the deployment.

#### Deploying to Vercel

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

3. Follow the prompts to complete the deployment.

#### Deploying to GitHub Pages

1. Install the gh-pages package:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add the following to `package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/techbuddy"
   }
   ```

3. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

## Environment Configuration

TechBuddy can be configured using environment variables:

1. Create a `.env` file in the root directory:
   ```
   VITE_API_URL=https://api.example.com
   VITE_DEBUG_MODE=false
   ```

2. Access environment variables in the code:
   ```jsx
   const apiUrl = import.meta.env.VITE_API_URL
   ```

Note: Only variables prefixed with `VITE_` will be exposed to the client-side code.

## Continuous Integration/Continuous Deployment

### GitHub Actions

You can set up CI/CD using GitHub Actions:

1. Create a `.github/workflows/deploy.yml` file:
   ```yaml
   name: Deploy

   on:
     push:
       branches: [ main ]

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Use Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '16'
         - name: Install dependencies
           run: npm ci
         - name: Build
           run: npm run build
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. Push the changes to GitHub to trigger the workflow.

## Troubleshooting

### Common Issues

#### Build Failures

If the build fails, check:
- Node.js version (should be v14 or higher)
- Package dependencies are installed correctly
- No syntax errors in the code

#### Runtime Errors

If the application doesn't run correctly:
- Check the browser console for errors
- Verify environment variables are set correctly
- Ensure all API endpoints are accessible

#### Docker Issues

If Docker deployment fails:
- Ensure Docker is installed and running
- Check if port 3000 is already in use
- Verify the Dockerfile has the correct configuration

### Getting Help

If you encounter issues not covered in this guide:
- Check the project's GitHub issues
- Consult the React and Vite documentation
- Reach out to the project maintainers

