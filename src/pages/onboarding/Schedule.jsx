import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container,
  Alert,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Grid,
  CircularProgress
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { saveUserProfile, getUserProfile } from '../../services/user';
import { createFastingPlan } from '../../services/fastingPlan';

const steps = ['Basic Info', 'Goals', 'Schedule'];

const Schedule = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile, updateFastingPlan } = useAuth();
  
  const [wakeTime, setWakeTime] = useState(new Date(new Date().setHours(7, 0, 0, 0)));
  const [sleepTime, setSleepTime] = useState(new Date(new Date().setHours(22, 0, 0, 0)));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          setUserProfile(profile);
          
          // If user has already completed this step, pre-fill the form
          if (profile && profile.wakeTime) {
            setWakeTime(new Date(profile.wakeTime));
          }
          
          if (profile && profile.sleepTime) {
            setSleepTime(new Date(profile.sleepTime));
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    
    fetchUserProfile();
  }, [currentUser]);
  
  const handleFinish = async () => {
    // Validate inputs
    if (!wakeTime || !sleepTime) {
      setError('Please select both wake and sleep times');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // Format times as strings (HH:MM)
      const wakeTimeStr = wakeTime.toTimeString().substring(0, 5);
      const sleepTimeStr = sleepTime.toTimeString().substring(0, 5);
      
      // Save schedule to Firestore
      if (currentUser) {
        await saveUserProfile(currentUser.uid, {
          wakeTime: wakeTimeStr,
          sleepTime: sleepTimeStr,
          onboardingCompleted: true // Mark onboarding as completed
        });
        
        // Fetch the complete user profile
        const updatedProfile = await getUserProfile(currentUser.uid);
        updateUserProfile(updatedProfile);
        
        // Generate fasting plan
        setGeneratingPlan(true);
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
      }
      
      // Navigate to dashboard
      navigate('/timer');
    } catch (error) {
      console.error("Error saving schedule:", error);
      setError(error.message || 'Failed to save your schedule. Please try again.');
    } finally {
      setLoading(false);
      setGeneratingPlan(false);
    }
  };
  
  const handleBack = () => {
    navigate('/onboarding/goals');
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Your Daily Schedule
          </Typography>
          
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Tell us about your typical daily schedule to optimize your fasting windows
          </Typography>
          
          <Stepper activeStep={2} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" noValidate>
            <Grid container spacing={3}>
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
            </Grid>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Your fasting schedule will be optimized based on your wake and sleep times to ensure the best results for your goals.
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={loading || generatingPlan}
              >
                Back
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleFinish}
                disabled={loading || generatingPlan}
                startIcon={generatingPlan ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Saving...' : generatingPlan ? 'Generating Plan...' : 'Finish'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default Schedule;

