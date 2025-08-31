import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper,
  Button,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MoodSelector from '../components/MoodSelector';
import VoiceRecorder from '../components/VoiceRecorder';
import { submitDailyCheckIn, getTodayCheckIn } from '../services/checkIn';

const CheckInPage = () => {
  const navigate = useNavigate();
  const { currentUser, subscription, updateFastingPlan } = useAuth();
  
  const [mood, setMood] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [hungerLevel, setHungerLevel] = useState(3);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Check if user has already completed today's check-in
  useEffect(() => {
    const checkStatus = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        const todayCheckIn = await getTodayCheckIn(currentUser.uid);
        
        if (todayCheckIn) {
          // Pre-fill form with today's check-in data
          setMood(todayCheckIn.mood || 3);
          setEnergyLevel(todayCheckIn.energyLevel || 3);
          setHungerLevel(todayCheckIn.hungerLevel || 3);
          setSleepQuality(todayCheckIn.sleepQuality || 3);
          setNotes(todayCheckIn.notes || '');
          setSuccess(true);
        }
      } catch (error) {
        console.error("Error checking check-in status:", error);
      } finally {
        setCheckingStatus(false);
      }
    };
    
    checkStatus();
  }, [currentUser, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    
    try {
      const checkInData = {
        mood,
        energyLevel,
        hungerLevel,
        sleepQuality,
        notes
      };
      
      const result = await submitDailyCheckIn(currentUser.uid, checkInData);
      
      // Update fasting plan in context
      updateFastingPlan(result.adjustedPlan);
      
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/timer');
      }, 2000);
    } catch (error) {
      console.error("Error submitting check-in:", error);
      setError(error.message || 'Failed to submit your check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (checkingStatus) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Daily Check-in
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        How are you feeling today? Your feedback helps us optimize your fasting plan.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Check-in submitted successfully! Your fasting plan has been adjusted based on your feedback.
        </Alert>
      )}
      
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <MoodSelector 
            mood={mood}
            setMood={setMood}
            energyLevel={energyLevel}
            setEnergyLevel={setEnergyLevel}
            hungerLevel={hungerLevel}
            setHungerLevel={setHungerLevel}
            sleepQuality={sleepQuality}
            setSleepQuality={setSleepQuality}
          />
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Additional Notes"
            placeholder="Share any additional thoughts about your fasting experience today..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mb: 4 }}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading || success}
            sx={{ py: 1.5, px: 4 }}
          >
            {loading ? 'Submitting...' : success ? 'Submitted' : 'Submit Check-in'}
          </Button>
        </Box>
      </Paper>
      
      <VoiceRecorder 
        disabled={loading || success}
        subscription={subscription}
      />
    </Container>
  );
};

export default CheckInPage;

