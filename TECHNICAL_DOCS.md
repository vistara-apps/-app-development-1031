# TechBuddy Technical Documentation

This document provides detailed technical information about the TechBuddy application architecture, component structure, and implementation details.

## Table of Contents

- [Application Architecture](#application-architecture)
- [Component Hierarchy](#component-hierarchy)
- [State Management](#state-management)
- [Routing](#routing)
- [Styling Approach](#styling-approach)
- [Build and Deployment](#build-and-deployment)
- [Performance Considerations](#performance-considerations)
- [Testing Strategy](#testing-strategy)
- [Future Enhancements](#future-enhancements)

## Application Architecture

TechBuddy follows a component-based architecture using React. The application is structured as follows:

```
App (Root Component)
├── Navigation (Persistent across all routes)
└── Routes
    ├── HomePage
    ├── DeviceSetupPage
    └── AppConfigPage
```

The application uses React Router for navigation and Material-UI (MUI) for UI components. The entry point is `main.jsx`, which sets up the React application with the necessary providers.

## Component Hierarchy

### Root Components

- **App.jsx**: The main application component that sets up routing and includes the Navigation component
- **main.jsx**: Application entry point that configures the React DOM rendering, theme, and router

### Shared Components

- **Navigation.jsx**: AppBar component that provides navigation links to all main pages

### Page Components

- **HomePage.jsx**: Landing page with feature overview
- **DeviceSetupPage.jsx**: Step-by-step wizard for device setup
- **AppConfigPage.jsx**: Settings page for accessibility configuration

## State Management

The application uses React's built-in state management with `useState` hooks for component-level state:

### DeviceSetupPage

```jsx
const [activeStep, setActiveStep] = useState(0)
```

This state tracks the current step in the setup wizard.

### AppConfigPage

```jsx
const [fontSize, setFontSize] = useState(16)
const [highContrast, setHighContrast] = useState(false)
```

These states manage the user's accessibility preferences.

For a small application like this, React's built-in state management is sufficient. For larger applications, consider implementing a more robust state management solution like Redux or Context API.

## Routing

Routing is implemented using React Router v6. The main routes are defined in `App.jsx`:

```jsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/device-setup" element={<DeviceSetupPage />} />
  <Route path="/app-config" element={<AppConfigPage />} />
</Routes>
```

Navigation between routes is handled by the `Navigation` component using Material-UI's `Button` component with React Router's `Link` component:

```jsx
<Button color="inherit" component={Link} to="/">Home</Button>
```

## Styling Approach

The application uses Material-UI (MUI) for styling with a custom theme defined in `main.jsx`:

```jsx
const theme = createTheme({
  typography: {
    fontFamily: ['Arial', 'sans-serif'].join(','),
    fontSize: 16,
  },
  palette: {
    primary: {
      main: '#3F51B5', // Accessible blue
    },
    secondary: {
      main: '#F50057', // Complementary color
    }
  }
})
```

This theme is applied using MUI's `ThemeProvider` to ensure consistent styling throughout the application.

Additional global styles are defined in `index.html`:

```html
<style>
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f4;
  }
</style>
```

Component-specific styles are applied using inline styles or MUI's styling props.

## Build and Deployment

### Build Process

The application uses Vite as its build tool. The build process is configured in `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js'
  }
})
```

To build the application for production, run:

```bash
npm run build
```

This generates optimized static files in the `dist` directory.

### Docker Deployment

The application includes a Dockerfile for containerization:

```dockerfile
FROM --platform=linux/amd64 registry.vistara.dev/zara-base:latest AS builder
WORKDIR /app
COPY package*.json ./
USER root
COPY . .
RUN npm i && npm run build

FROM --platform=linux/amd64 registry.vistara.dev/zara-base:latest AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
USER appuser
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

This Dockerfile uses a multi-stage build process:
1. **Builder stage**: Installs dependencies and builds the application
2. **Runner stage**: Serves the built application using a lightweight server

## Performance Considerations

### Code Splitting

The application does not currently implement code splitting, but for larger applications, consider using dynamic imports to split the bundle by route:

```jsx
const HomePage = React.lazy(() => import('./pages/HomePage'))
```

### Optimization Opportunities

- Implement React.memo for components that don't need frequent re-renders
- Add image optimization for any images added to the application
- Consider implementing service workers for offline capabilities

## Testing Strategy

The application is set up for testing with Vitest, as configured in `vite.config.js`. Tests should be organized as follows:

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **End-to-End Tests**: Test complete user flows

Test files should be placed alongside the components they test with a `.test.jsx` extension.

## Future Enhancements

Potential improvements for future versions:

1. **Backend Integration**: Add a backend API for user accounts and data persistence
2. **More Accessibility Features**: Add screen reader support, keyboard navigation, and more customization options
3. **Expanded Device Support**: Add guides for more types of devices and technologies
4. **User Profiles**: Allow multiple user profiles with different accessibility settings
5. **Interactive Tutorials**: Add interactive, animated tutorials for common tasks

