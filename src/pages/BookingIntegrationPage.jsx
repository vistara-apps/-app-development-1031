import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Tabs, 
  Tab, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';

// Import booking integration manager
// In a real app, these would be properly imported from the actual modules
const mockBookingIntegrationManager = {
  registerIntegration: () => console.log('Registering integration'),
  initializeIntegration: () => new Promise(resolve => setTimeout(() => resolve(true), 1000)),
  testConnection: () => new Promise(resolve => setTimeout(() => resolve(true), 1000))
};

// Mock platform configurations
const platformConfigs = {
  vagaro: {
    name: 'Vagaro',
    fields: [
      { name: 'clientId', label: 'Client ID', type: 'text' },
      { name: 'clientSecret', label: 'Client Secret', type: 'password' },
      { name: 'redirectUri', label: 'Redirect URI', type: 'text' }
    ]
  },
  mindbody: {
    name: 'Mindbody',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password' },
      { name: 'siteId', label: 'Site ID', type: 'text' }
    ]
  },
  phorest: {
    name: 'Phorest',
    fields: [
      { name: 'clientId', label: 'Client ID', type: 'text' },
      { name: 'clientSecret', label: 'Client Secret', type: 'password' },
      { name: 'redirectUri', label: 'Redirect URI', type: 'text' },
      { name: 'businessId', label: 'Business ID', type: 'text' },
      { name: 'branchId', label: 'Branch ID', type: 'text' }
    ]
  }
};

// Mock rebooking suggestions
const mockSuggestions = [
  {
    id: '1',
    service: { name: 'Haircut', duration: 45, price: 65 },
    provider: { firstName: 'John', lastName: 'Smith' },
    timeSlot: { startTime: '2025-09-15T14:00:00Z', endTime: '2025-09-15T14:45:00Z' },
    formattedDateTime: 'Monday, September 15, 2025 at 2:00 PM'
  },
  {
    id: '2',
    service: { name: 'Color Treatment', duration: 90, price: 120 },
    provider: { firstName: 'Sarah', lastName: 'Johnson' },
    timeSlot: { startTime: '2025-09-16T10:30:00Z', endTime: '2025-09-16T12:00:00Z' },
    formattedDateTime: 'Tuesday, September 16, 2025 at 10:30 AM'
  },
  {
    id: '3',
    service: { name: 'Blowout', duration: 30, price: 45 },
    provider: { firstName: 'Maria', lastName: 'Garcia' },
    timeSlot: { startTime: '2025-09-17T16:15:00Z', endTime: '2025-09-17T16:45:00Z' },
    formattedDateTime: 'Wednesday, September 17, 2025 at 4:15 PM'
  }
];

function BookingIntegrationPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [configValues, setConfigValues] = useState({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [suggestions, setSuggestions] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Load suggestions on component mount (mock data)
  useEffect(() => {
    setSuggestions(mockSuggestions);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePlatformChange = (event) => {
    setSelectedPlatform(event.target.value);
    setConfigValues({});
  };

  const handleConfigChange = (field) => (event) => {
    setConfigValues({
      ...configValues,
      [field]: event.target.value
    });
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionStatus(null);
    
    try {
      // In a real app, this would use the actual booking integration manager
      await mockBookingIntegrationManager.initializeIntegration(selectedPlatform, configValues);
      
      setConnectionStatus('success');
      setSnackbar({
        open: true,
        message: `Successfully connected to ${platformConfigs[selectedPlatform].name}!`,
        severity: 'success'
      });
    } catch (error) {
      setConnectionStatus('error');
      setSnackbar({
        open: true,
        message: `Connection failed: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTestConnection = async () => {
    setIsConnecting(true);
    
    try {
      // In a real app, this would use the actual booking integration manager
      const success = await mockBookingIntegrationManager.testConnection(selectedPlatform);
      
      setSnackbar({
        open: true,
        message: success 
          ? `Connection to ${platformConfigs[selectedPlatform].name} is working!` 
          : `Connection to ${platformConfigs[selectedPlatform].name} failed!`,
        severity: success ? 'success' : 'error'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Test failed: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleGenerateSuggestions = () => {
    if (!customerId) {
      setSnackbar({
        open: true,
        message: 'Please enter a customer ID',
        severity: 'warning'
      });
      return;
    }
    
    setIsLoadingSuggestions(true);
    
    // In a real app, this would call the actual rebooking service
    setTimeout(() => {
      setSuggestions(mockSuggestions);
      setIsLoadingSuggestions(false);
      setSnackbar({
        open: true,
        message: 'Generated rebooking suggestions!',
        severity: 'success'
      });
    }, 1500);
  };

  const handleBookAppointment = (suggestion) => {
    // In a real app, this would call the actual booking service
    setSnackbar({
      open: true,
      message: `Booked appointment: ${suggestion.service.name} with ${suggestion.provider.firstName} on ${suggestion.formattedDateTime}`,
      severity: 'success'
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        Booking Software Integration
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Connect Platform" />
          <Tab label="Rebooking" />
          <Tab label="Settings" />
        </Tabs>
        
        <Box p={3}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Connect to Booking Platform
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select Booking Platform</InputLabel>
                <Select
                  value={selectedPlatform}
                  onChange={handlePlatformChange}
                  label="Select Booking Platform"
                >
                  <MenuItem value="vagaro">Vagaro</MenuItem>
                  <MenuItem value="mindbody">Mindbody</MenuItem>
                  <MenuItem value="phorest">Phorest</MenuItem>
                </Select>
              </FormControl>
              
              {selectedPlatform && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    {platformConfigs[selectedPlatform].name} Configuration
                  </Typography>
                  
                  {platformConfigs[selectedPlatform].fields.map((field) => (
                    <TextField
                      key={field.name}
                      label={field.label}
                      type={field.type}
                      fullWidth
                      margin="normal"
                      value={configValues[field.name] || ''}
                      onChange={handleConfigChange(field.name)}
                    />
                  ))}
                  
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleConnect}
                      disabled={isConnecting}
                    >
                      {isConnecting ? <CircularProgress size={24} /> : 'Connect'}
                    </Button>
                    
                    {connectionStatus === 'success' && (
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={handleTestConnection}
                        disabled={isConnecting}
                      >
                        Test Connection
                      </Button>
                    )}
                  </Box>
                  
                  {connectionStatus === 'success' && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      Successfully connected to {platformConfigs[selectedPlatform].name}!
                    </Alert>
                  )}
                  
                  {connectionStatus === 'error' && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      Failed to connect. Please check your credentials and try again.
                    </Alert>
                  )}
                </Box>
              )}
            </Box>
          )}
          
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Rebooking Suggestions
              </Typography>
              
              <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                <TextField
                  label="Customer ID"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleGenerateSuggestions}
                  disabled={isLoadingSuggestions}
                >
                  {isLoadingSuggestions ? <CircularProgress size={24} /> : 'Generate Suggestions'}
                </Button>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>
                Available Rebooking Options
              </Typography>
              
              <Grid container spacing={3}>
                {suggestions.map((suggestion) => (
                  <Grid item xs={12} md={4} key={suggestion.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {suggestion.service.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          with {suggestion.provider.firstName} {suggestion.provider.lastName}
                        </Typography>
                        <Typography variant="body1">
                          {suggestion.formattedDateTime}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Duration: {suggestion.service.duration} minutes
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Price: ${suggestion.service.price}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          color="primary"
                          onClick={() => handleBookAppointment(suggestion)}
                        >
                          Book Appointment
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
                
                {suggestions.length === 0 && !isLoadingSuggestions && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      No rebooking suggestions available. Generate suggestions to see options.
                    </Alert>
                  </Grid>
                )}
                
                {isLoadingSuggestions && (
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
          
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Integration Settings
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Rebooking Preferences
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Default Rebooking Interval</InputLabel>
                <Select
                  value="monthly"
                  label="Default Rebooking Interval"
                >
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="biweekly">Bi-weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Notification Preferences</InputLabel>
                <Select
                  value="email"
                  label="Notification Preferences"
                >
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="sms">SMS</MenuItem>
                  <MenuItem value="both">Both Email and SMS</MenuItem>
                  <MenuItem value="none">None</MenuItem>
                </Select>
              </FormControl>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                API Settings
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>API Request Timeout</InputLabel>
                <Select
                  value="30"
                  label="API Request Timeout"
                >
                  <MenuItem value="10">10 seconds</MenuItem>
                  <MenuItem value="30">30 seconds</MenuItem>
                  <MenuItem value="60">60 seconds</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Retry Failed Requests</InputLabel>
                <Select
                  value="3"
                  label="Retry Failed Requests"
                >
                  <MenuItem value="0">No retries</MenuItem>
                  <MenuItem value="1">1 retry</MenuItem>
                  <MenuItem value="3">3 retries</MenuItem>
                  <MenuItem value="5">5 retries</MenuItem>
                </Select>
              </FormControl>
              
              <Box sx={{ mt: 3 }}>
                <Button variant="contained" color="primary">
                  Save Settings
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default BookingIntegrationPage;

