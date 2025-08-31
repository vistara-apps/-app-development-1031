import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  Button,
  Alert,
  CircularProgress,
  Divider,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Tabs,
  Tab
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Paywall from '../components/Paywall';
import { getUserProfile, saveUserProfile } from '../services/user';
import { createFastingPlan } from '../services/fastingPlan';
import { getUserSubscription, updateUserSubscription, SUBSCRIPTION_TIERS } from '../services/subscription';
import { requestNotificationPermission, hasNotificationPermission } from '../services/notifications';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, updateUserProfile, updateFastingPlan, updateSubscription } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  // Profile settings
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  
  // Fasting settings
  const [goal, setGoal] = useState('');
  const [wakeTime, setWakeTime] = useState(new Date(new Date().setHours(7, 0, 0, 0)));
  const [sleepTime, setSleepTime] = useState(new Date(new Date().setHours(22, 0, 0, 0)));
  const [experience, setExperience] = useState('');
  
  // Notification settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [fastStartNotification, setFastStartNotification] = useState(true);
  const [fastEndNotification, setFastEndNotification] = useState(true);
  const [checkInReminder, setCheckInReminder] = useState(true);
  
  // Subscription settings
  const [subscriptionTier, setSubscriptionTier] = useState(SUBSCRIPTION_TIERS.FREE);
  
  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        // Fetch user profile if not in context
        const profile = userProfile || await getUserProfile(currentUser.uid);
        
        if (profile) {
          // Set profile settings
          setDisplayName(profile.displayName || currentUser.displayName || '');
          setAge(profile.age || '');
          setGender(profile.gender || '');
          setWeight(profile.weight || '');
          setHeight(profile.height || '');
          
          // Set fasting settings
          setGoal(profile.goal || '');
          setExperience(profile.fastingExperience || '');
          
          if (profile.wakeTime) {
            const [hours, minutes] = profile.wakeTime.split(':').map(Number);
            setWakeTime(new Date(new Date().setHours(hours, minutes, 0, 0)));
          }
          
          if (profile.sleepTime) {
            const [hours, minutes] = profile.sleepTime.split(':').map(Number);
            setSleepTime(new Date(new Date().setHours(hours, minutes, 0, 0)));
          }
        }
        
        // Fetch subscription status
        const subscriptionData = await getUserSubscription(currentUser.uid);
        setSubscriptionTier(subscriptionData.tier);
        
        // Check notification permission
        setNotificationsEnabled(hasNotificationPermission());
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError('Failed to load your settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser, navigate, userProfile]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSaveProfile = async () => {
    // Validate inputs
    if (!displayName) {
      setError('Please enter your name');
      return;
    }
    
    if (!age || isNaN(age) || age < 18 || age > 100) {
      setError('Please enter a valid age between 18 and 100');
      return;
    }
    
    if (!gender) {
      setError('Please select your gender');
      return;
    }
    
    if (!weight || isNaN(weight) || weight < 30 || weight > 300) {
      setError('Please enter a valid weight between 30 and 300 kg');
      return;
    }
    
    if (!height || isNaN(height) || height < 100 || height > 250) {
      setError('Please enter a valid height between 100 and 250 cm');
      return;
    }
    
    setError('');
    setSaving(true);
    
    try {
      // Save profile to Firestore
      await saveUserProfile(currentUser.uid, {
        displayName,
        age: parseInt(age),
        gender,
        weight: parseFloat(weight),
        height: parseFloat(height)
      });
      
      // Update profile in context
      const updatedProfile = await getUserProfile(currentUser.uid);
      updateUserProfile(updatedProfile);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setError(error.message || 'Failed to save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleSaveFastingSettings = async () => {
    // Validate inputs
    if (!goal) {
      setError('Please select your primary goal');
      return;
    }
    
    if (!wakeTime || !sleepTime) {
      setError('Please select both wake and sleep times');
      return;
    }
    
    if (!experience) {
      setError('Please select your fasting experience level');
      return;
    }
    
    setError('');
    setSaving(true);
    
    try {
      // Format times as strings (HH:MM)
      const wakeTimeStr = wakeTime.toTimeString().substring(0, 5);
      const sleepTimeStr = sleepTime.toTimeString().substring(0, 5);
      
      // Save fasting settings to Firestore
      await saveUserProfile(currentUser.uid, {
        goal,
        wakeTime: wakeTimeStr,
        sleepTime: sleepTimeStr,
        fastingExperience: experience
      });
      
      // Update profile in context
      const updatedProfile = await getUserProfile(currentUser.uid);
      updateUserProfile(updatedProfile);
      
      // Generate new fasting plan
      const planData = await createFastingPlan(currentUser.uid, {
        age: updatedProfile.age,
        gender: updatedProfile.gender,
        weight: updatedProfile.weight,
        goal: updatedProfile.goal,
        sleepTime: sleepTimeStr,
        wakeTime: wakeTimeStr,
        fastingExperience: updatedProfile.fastingExperience
      });
      
      updateFastingPlan(planData);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving fasting settings:", error);
      setError(error.message || 'Failed to save your fasting settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleEnableNotifications = async () => {
    try {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
      
      if (!granted) {
        setError('Notification permission denied. Please enable notifications in your browser settings.');
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      setError('Failed to enable notifications. Please try again.');
    }
  };
  
  const handleUpgradeSubscription = async () => {
    try {
      // In a real app, this would integrate with a payment processor
      const updatedSubscription = await updateUserSubscription(
        currentUser.uid, 
        SUBSCRIPTION_TIERS.PREMIUM,
        {
          startDate: new Date().toISOString(),
          plan: 'monthly',
          price: 9.99
        }
      );
      
      setSubscriptionTier(SUBSCRIPTION_TIERS.PREMIUM);
      updateSubscription(updatedSubscription);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error upgrading subscription:", error);
      setError(error.message || 'Failed to upgrade your subscription. Please try again.');
    }
  };
  
  const handleDowngradeSubscription = async () => {
    try {
      // In a real app, this would integrate with a payment processor
      const updatedSubscription = await updateUserSubscription(
        currentUser.uid, 
        SUBSCRIPTION_TIERS.FREE
      );
      
      setSubscriptionTier(SUBSCRIPTION_TIERS.FREE);
      updateSubscription(updatedSubscription);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error downgrading subscription:", error);
      setError(error.message || 'Failed to downgrade your subscription. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings saved successfully!
          </Alert>
        )}
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Profile" />
          <Tab label="Fasting Plan" />
          <Tab label="Notifications" />
          <Tab label="Subscription" />
        </Tabs>
        
        {/* Profile Settings */}
        {tabValue === 0 && (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Profile Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  InputProps={{
                    inputProps: { min: 18, max: 100 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={8}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  InputProps={{
                    inputProps: { min: 30, max: 300, step: 0.1 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  InputProps={{
                    inputProps: { min: 100, max: 250, step: 0.1 }
                  }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </Box>
          </Paper>
        )}
        
        {/* Fasting Plan Settings */}
        {tabValue === 1 && (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Fasting Plan Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Primary Goal</FormLabel>
                  <RadioGroup
                    name="goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  >
                    <FormControlLabel value="fat_loss" control={<Radio />} label="Fat Loss" />
                    <FormControlLabel value="energy" control={<Radio />} label="Energy & Focus" />
                    <FormControlLabel value="gut_health" control={<Radio />} label="Gut Health" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Wake-up Time
                </Typography>
                <TimePicker
                  value={wakeTime}
                  onChange={setWakeTime}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Bedtime
                </Typography>
                <TimePicker
                  value={sleepTime}
                  onChange={setSleepTime}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Fasting Experience</FormLabel>
                  <RadioGroup
                    name="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    <FormControlLabel 
                      value="beginner" 
                      control={<Radio />} 
                      label="Beginner - I've never tried fasting before" 
                    />
                    <FormControlLabel 
                      value="intermediate" 
                      control={<Radio />} 
                      label="Intermediate - I've tried fasting occasionally" 
                    />
                    <FormControlLabel 
                      value="advanced" 
                      control={<Radio />} 
                      label="Advanced - I fast regularly and want to optimize my routine" 
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveFastingSettings}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Update Fasting Plan'}
              </Button>
            </Box>
          </Paper>
        )}
        
        {/* Notification Settings */}
        {tabValue === 2 && (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationsEnabled}
                    onChange={handleEnableNotifications}
                    color="primary"
                  />
                }
                label="Enable Notifications"
              />
              
              {!notificationsEnabled && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Enable notifications to receive reminders about your fasting schedule.
                </Typography>
              )}
            </Box>
            
            {notificationsEnabled && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={fastStartNotification}
                        onChange={(e) => setFastStartNotification(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Fasting Start Reminder"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={fastEndNotification}
                        onChange={(e) => setFastEndNotification(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Fasting End Notification"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={checkInReminder}
                        onChange={(e) => setCheckInReminder(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Daily Check-in Reminder"
                  />
                </Grid>
              </Grid>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                disabled={saving}
              >
                Save Notification Settings
              </Button>
            </Box>
          </Paper>
        )}
        
        {/* Subscription Settings */}
        {tabValue === 3 && (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Subscription Settings
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1">
                Current Plan: {subscriptionTier === SUBSCRIPTION_TIERS.PREMIUM ? 'Premium' : 'Free'}
              </Typography>
              
              {subscriptionTier === SUBSCRIPTION_TIERS.PREMIUM && (
                <Typography variant="body2" color="text.secondary">
                  You have access to all premium features.
                </Typography>
              )}
            </Box>
            
            {subscriptionTier === SUBSCRIPTION_TIERS.FREE ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpgradeSubscription}
                disabled={saving}
              >
                Upgrade to Premium
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleDowngradeSubscription}
                disabled={saving}
              >
                Downgrade to Free
              </Button>
            )}
            
            <Divider sx={{ my: 4 }} />
            
            <Paywall />
          </Paper>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default SettingsPage;

