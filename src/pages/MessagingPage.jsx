import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import MessageManager from '../components/MessageManager';
import { 
  sampleAppointments, 
  sampleUsers, 
  scheduleFollowUpSequence 
} from '../services/messagingService';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`messaging-tabpanel-${index}`}
      aria-labelledby={`messaging-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function MessagingPage() {
  const [tabValue, setTabValue] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreateClick = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleAppointmentChange = (event) => {
    const appointmentId = Number(event.target.value);
    setSelectedAppointment(appointmentId);
  };

  const handleCreateSequence = async () => {
    if (!selectedAppointment) {
      setSnackbarMessage('Please select an appointment');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      await scheduleFollowUpSequence(selectedAppointment);
      setSnackbarMessage('Follow-up message sequence created successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setCreateDialogOpen(false);
    } catch (error) {
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Filter completed appointments
  const completedAppointments = sampleAppointments.filter(
    appointment => appointment.status === 'completed'
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Messaging System
      </Typography>
      <Typography variant="subtitle1" paragraph>
        Configure automated, personalized messaging workflow for post-appointment follow-ups
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="messaging tabs">
          <Tab label="Message Manager" />
          <Tab label="Templates" />
          <Tab label="Analytics" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateClick}
          >
            Create New Message Sequence
          </Button>
        </Box>
        <MessageManager />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Message Templates
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Follow-up Template
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                Hello {'{name}'},

                Thank you for your recent appointment with TechBuddy. We hope you're enjoying your {'{deviceType}'}! How has your experience been so far? If you have any questions about what we covered during our session, please don't hesitate to reply to this email.

                Best regards,
                The TechBuddy Team
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Reminder Template
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                Hello {'{name}'},

                Just a friendly reminder of what we covered in our recent TechBuddy session:

                {'{notes}'}

                Don't forget to practice these skills to build your confidence. We're here if you need any further assistance!

                Best regards,
                The TechBuddy Team
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Tip Template
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                Hello {'{name}'},

                Here's a quick tip for your {'{deviceType}'} that you might find useful:

                {'{tipContent}'}

                We hope this helps enhance your experience!

                Best regards,
                The TechBuddy Team
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Messaging Analytics
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Analytics dashboard is under development. Check back soon for insights on message performance.
        </Alert>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Message Statistics (Sample Data)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="h4" align="center">85%</Typography>
                <Typography variant="body2" align="center">Open Rate</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="h4" align="center">42%</Typography>
                <Typography variant="body2" align="center">Response Rate</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                <Typography variant="h4" align="center">12</Typography>
                <Typography variant="body2" align="center">Avg. Messages per User</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>

      {/* Create Message Sequence Dialog */}
      <Dialog open={createDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Create Message Sequence</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph sx={{ mt: 1 }}>
            This will create a series of follow-up messages for a completed appointment.
          </Typography>
          
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="appointment-select-label">Select Appointment</InputLabel>
            <Select
              labelId="appointment-select-label"
              value={selectedAppointment || ''}
              label="Select Appointment"
              onChange={handleAppointmentChange}
            >
              {completedAppointments.map(appointment => {
                const user = sampleUsers.find(u => u.id === appointment.userId);
                return (
                  <MenuItem key={appointment.id} value={appointment.id}>
                    {user?.name} - {appointment.deviceType} ({new Date(appointment.appointmentDate).toLocaleDateString()})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          
          <Typography variant="body2" sx={{ mt: 2 }}>
            The following messages will be scheduled:
          </Typography>
          <ul>
            <li>Initial follow-up (1 day after appointment)</li>
            <li>Session reminder (3 days after appointment)</li>
            <li>Helpful tip (7 days after appointment)</li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateSequence} variant="contained" color="primary">
            Create Sequence
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default MessagingPage;

