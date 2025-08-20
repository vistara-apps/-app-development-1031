# TechBuddy Component API Documentation

This document provides detailed information about each component in the TechBuddy application, including props, state, and usage examples.

## Table of Contents

- [Navigation Component](#navigation-component)
- [HomePage Component](#homepage-component)
- [DeviceSetupPage Component](#devicesetuppage-component)
- [AppConfigPage Component](#appconfigpage-component)
- [App Component](#app-component)

## Navigation Component

**File**: `src/components/Navigation.jsx`

### Description

The Navigation component provides the main navigation bar for the application using Material-UI's AppBar component.

### Props

This component does not accept any props.

### Implementation Details

```jsx
import React from 'react'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          TechBuddy
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/device-setup">Device Setup</Button>
        <Button color="inherit" component={Link} to="/app-config">App Config</Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
```

### Usage Example

```jsx
import Navigation from './components/Navigation'

function App() {
  return (
    <div>
      <Navigation />
      {/* Other components */}
    </div>
  )
}
```

## HomePage Component

**File**: `src/pages/HomePage.jsx`

### Description

The HomePage component serves as the landing page for the application, providing an overview of the main features.

### Props

This component does not accept any props.

### Implementation Details

```jsx
import React from 'react'
import { Container, Typography, Grid, Paper } from '@mui/material'

function HomePage() {
  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Welcome to TechBuddy
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5">Guided Device Setup</Typography>
            <Typography>
              We help seniors navigate new technology with easy, step-by-step guides.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5">App Configuration</Typography>
            <Typography>
              Customize your device for comfort and ease of use.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default HomePage
```

### Usage Example

```jsx
import { Route } from 'react-router-dom'
import HomePage from './pages/HomePage'

<Route path="/" element={<HomePage />} />
```

## DeviceSetupPage Component

**File**: `src/pages/DeviceSetupPage.jsx`

### Description

The DeviceSetupPage component provides a step-by-step wizard for setting up new devices.

### Props

This component does not accept any props.

### State

| State Variable | Type | Default | Description |
|----------------|------|---------|-------------|
| activeStep | number | 0 | The current active step in the setup wizard |

### Methods

| Method | Parameters | Return | Description |
|--------|------------|--------|-------------|
| handleNext | None | void | Advances to the next step in the wizard |
| handleBack | None | void | Returns to the previous step in the wizard |

### Implementation Details

```jsx
import React, { useState } from 'react'
import { 
  Container, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Button 
} from '@mui/material'

const deviceSetupSteps = [
  'Choose Your Device',
  'Basic Configuration',
  'Connectivity Setup',
  'Personalization'
]

function DeviceSetupPage() {
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  return (
    <Container>
      <Typography variant="h4">Device Setup Wizard</Typography>
      <Stepper activeStep={activeStep}>
        {deviceSetupSteps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <div>
        {activeStep === deviceSetupSteps.length ? (
          <Typography>Setup Complete!</Typography>
        ) : (
          <>
            <Typography variant="h6">
              {deviceSetupSteps[activeStep]}
            </Typography>
            
            <div>
              <Button 
                disabled={activeStep === 0} 
                onClick={handleBack}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNext}
              >
                {activeStep === deviceSetupSteps.length - 1 
                  ? 'Finish' 
                  : 'Next'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Container>
  )
}

export default DeviceSetupPage
```

### Usage Example

```jsx
import { Route } from 'react-router-dom'
import DeviceSetupPage from './pages/DeviceSetupPage'

<Route path="/device-setup" element={<DeviceSetupPage />} />
```

## AppConfigPage Component

**File**: `src/pages/AppConfigPage.jsx`

### Description

The AppConfigPage component allows users to customize accessibility settings.

### Props

This component does not accept any props.

### State

| State Variable | Type | Default | Description |
|----------------|------|---------|-------------|
| fontSize | number | 16 | The font size setting (in pixels) |
| highContrast | boolean | false | Whether high contrast mode is enabled |

### Implementation Details

```jsx
import React, { useState } from 'react'
import { 
  Container, 
  Typography, 
  Switch, 
  FormControlLabel, 
  Slider 
} from '@mui/material'

function AppConfigPage() {
  const [fontSize, setFontSize] = useState(16)
  const [highContrast, setHighContrast] = useState(false)

  return (
    <Container>
      <Typography variant="h4">App Accessibility Settings</Typography>
      
      <div style={{ marginTop: '20px' }}>
        <Typography gutterBottom>Font Size</Typography>
        <Slider
          value={fontSize}
          onChange={(e, newValue) => setFontSize(newValue)}
          min={12}
          max={24}
          valueLabelDisplay="auto"
        />
      </div>

      <FormControlLabel
        control={
          <Switch
            checked={highContrast}
            onChange={() => setHighContrast(!highContrast)}
          />
        }
        label="High Contrast Mode"
      />
    </Container>
  )
}

export default AppConfigPage
```

### Usage Example

```jsx
import { Route } from 'react-router-dom'
import AppConfigPage from './pages/AppConfigPage'

<Route path="/app-config" element={<AppConfigPage />} />
```

## App Component

**File**: `src/App.jsx`

### Description

The App component is the root component of the application. It sets up the routing and includes the Navigation component.

### Props

This component does not accept any props.

### Implementation Details

```jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import DeviceSetupPage from './pages/DeviceSetupPage'
import AppConfigPage from './pages/AppConfigPage'

function App() {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/device-setup" element={<DeviceSetupPage />} />
        <Route path="/app-config" element={<AppConfigPage />} />
      </Routes>
    </div>
  )
}

export default App
```

### Usage Example

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import App from './App'

const theme = createTheme({
  // Theme configuration
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
```

