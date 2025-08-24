import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { Save, Notifications, BusinessCenter, AccessTime } from '@mui/icons-material';

function SettingsPage() {
  // Salon profile settings
  const [salonName, setSalonName] = useState('Elegance Hair & Beauty');
  const [ownerName, setOwnerName] = useState('Sarah Johnson');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [email, setEmail] = useState('contact@elegancesalon.com');
  const [address, setAddress] = useState('123 Style Street, Beauty City');
  
  // Business hours settings
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('19:00');
  const [daysOpen, setDaysOpen] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Rebooking settings
  const [autoRebookReminder, setAutoRebookReminder] = useState(true);
  const [rebookReminderDays, setRebookReminderDays] = useState(30);
  
  // Save settings notification
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  const handleSaveSettings = () => {
    // In a real app, this would save to a backend
    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Salon Settings
      </Typography>
      
      {showSaveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Salon Profile */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Salon Profile" 
              avatar={<BusinessCenter color="primary" />}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Salon Name"
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Owner Name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Business Hours */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Business Hours" 
              avatar={<AccessTime color="primary" />}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Opening Time"
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Closing Time"
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Days Open</InputLabel>
                    <Select
                      multiple
                      value={daysOpen}
                      onChange={(e) => setDaysOpen(e.target.value)}
                      renderValue={(selected) => selected.join(', ')}
                    >
                      <MenuItem value="Monday">Monday</MenuItem>
                      <MenuItem value="Tuesday">Tuesday</MenuItem>
                      <MenuItem value="Wednesday">Wednesday</MenuItem>
                      <MenuItem value="Thursday">Thursday</MenuItem>
                      <MenuItem value="Friday">Friday</MenuItem>
                      <MenuItem value="Saturday">Saturday</MenuItem>
                      <MenuItem value="Sunday">Sunday</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Notification Settings" 
              avatar={<Notifications color="primary" />}
            />
            <Divider />
            <CardContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications(!emailNotifications)}
                    color="primary"
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={smsNotifications}
                    onChange={() => setSmsNotifications(!smsNotifications)}
                    color="primary"
                  />
                }
                label="SMS Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={appointmentReminders}
                    onChange={() => setAppointmentReminders(!appointmentReminders)}
                    color="primary"
                  />
                }
                label="Appointment Reminders"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={marketingEmails}
                    onChange={() => setMarketingEmails(!marketingEmails)}
                    color="primary"
                  />
                }
                label="Marketing Emails"
              />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Rebooking Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Rebooking Settings" 
              avatar={<Notifications color="primary" />}
            />
            <Divider />
            <CardContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRebookReminder}
                    onChange={() => setAutoRebookReminder(!autoRebookReminder)}
                    color="primary"
                  />
                }
                label="Automatic Rebooking Reminders"
              />
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Send Rebooking Reminder After (days)"
                  type="number"
                  value={rebookReminderDays}
                  onChange={(e) => setRebookReminderDays(e.target.value)}
                  disabled={!autoRebookReminder}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
      </Box>
    </Container>
  );
}

export default SettingsPage;

