import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  Button,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FastingTimer from '../components/FastingTimer';
import { getCurrentFastingPlan } from '../services/fastingPlan';
import { getTodayCheckIn } from '../services/checkIn';
import { formatTime } from '../utils/timeUtils';

const TimerPage = () => {
  const navigate = useNavigate();
  const { currentUser, fastingPlan, updateFastingPlan } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkInCompleted, setCheckInCompleted] = useState(false);
  
  // Fetch fasting plan and check-in status
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        // Fetch current fasting plan if not in context
        if (!fastingPlan) {
          const plan = await getCurrentFastingPlan(currentUser.uid);
          updateFastingPlan(plan);
        }
        
        // Check if today's check-in is completed
        const todayCheckIn = await getTodayCheckIn(currentUser.uid);
        setCheckInCompleted(!!todayCheckIn);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Failed to load your fasting plan. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser, fastingPlan, navigate, updateFastingPlan]);
  
  const handleCheckIn = () => {
    navigate('/check-in');
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Fasting Timer
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <FastingTimer />
          
          {!checkInCompleted && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mt: 3, 
                borderRadius: 4,
                bgcolor: 'primary.light',
                color: 'primary.contrastText'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Daily Check-in
                </Typography>
                
                <Button 
                  variant="contained" 
                  color="secondary"
                  onClick={handleCheckIn}
                >
                  Check In Now
                </Button>
              </Box>
              
              <Typography variant="body1" sx={{ mt: 1 }}>
                How are you feeling today? Complete your daily check-in to help us optimize your fasting plan.
              </Typography>
            </Paper>
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Today's Fasting Plan
            </Typography>
            
            {fastingPlan ? (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Protocol
                  </Typography>
                  <Typography variant="body1">
                    {fastingPlan.protocol}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Eating Window
                  </Typography>
                  <Typography variant="body1">
                    {fastingPlan.eatingWindow ? 
                      `${fastingPlan.eatingWindow.start} - ${fastingPlan.eatingWindow.end}` : 
                      'Not specified'}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fasting Window
                  </Typography>
                  <Typography variant="body1">
                    {fastingPlan.fastingWindow ? 
                      `${fastingPlan.fastingWindow.start} - ${fastingPlan.fastingWindow.end}` : 
                      'Not specified'}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Recommendations
                  </Typography>
                  {fastingPlan.recommendations && fastingPlan.recommendations.length > 0 ? (
                    <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                      {fastingPlan.recommendations.map((rec, index) => (
                        <Typography component="li" variant="body2" key={index} sx={{ mb: 1 }}>
                          {rec}
                        </Typography>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2">No specific recommendations</Typography>
                  )}
                </Box>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No fasting plan available. Complete your onboarding to get a personalized plan.
              </Typography>
            )}
            
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="outlined" 
                color="primary"
                fullWidth
                component="a"
                href="/plan"
              >
                View Full Plan
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TimerPage;

