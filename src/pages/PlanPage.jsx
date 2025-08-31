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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Restaurant as RestaurantIcon,
  NoFood as NoFoodIcon,
  Info as InfoIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentFastingPlan } from '../services/fastingPlan';
import { formatTime } from '../utils/timeUtils';

const PlanPage = () => {
  const navigate = useNavigate();
  const { currentUser, fastingPlan, updateFastingPlan } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch fasting plan
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
      } catch (error) {
        console.error("Error fetching fasting plan:", error);
        setError('Failed to load your fasting plan. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser, fastingPlan, navigate, updateFastingPlan]);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!fastingPlan) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          You don't have a fasting plan yet. Complete your onboarding to get a personalized plan.
        </Alert>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/onboarding')}
        >
          Complete Onboarding
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Your Fasting Plan
        </Typography>
        
        <Button 
          variant="outlined" 
          startIcon={<EditIcon />}
          onClick={() => navigate('/settings')}
        >
          Adjust Plan
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ScheduleIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
              <Typography variant="h5">
                {fastingPlan.protocol}
              </Typography>
              
              <Chip 
                label="Current Plan" 
                color="primary" 
                size="small"
                sx={{ ml: 2 }}
              />
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <RestaurantIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Eating Window
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {fastingPlan.eatingWindow ? 
                    `${fastingPlan.eatingWindow.start} - ${fastingPlan.eatingWindow.end}` : 
                    'Not specified'}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  This is when you should consume all your meals and snacks.
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <NoFoodIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Fasting Window
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {fastingPlan.fastingWindow ? 
                    `${fastingPlan.fastingWindow.start} - ${fastingPlan.fastingWindow.end}` : 
                    'Not specified'}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  During this time, avoid all caloric intake to maximize fasting benefits.
                </Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InfoIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Recommendations
                </Typography>
              </Box>
              
              {fastingPlan.recommendations && fastingPlan.recommendations.length > 0 ? (
                <List>
                  {fastingPlan.recommendations.map((rec, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1">
                  No specific recommendations available.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Schedule
            </Typography>
            
            {fastingPlan.weeklySchedule && fastingPlan.weeklySchedule.length > 0 ? (
              <List>
                {fastingPlan.weeklySchedule.map((day, index) => (
                  <React.Fragment key={day.day}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem>
                      <ListItemText
                        primary={day.day}
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {day.protocol}
                            </Typography>
                            <br />
                            <Typography variant="body2" component="span" color="text.secondary">
                              Eating: {day.eatingWindow ? 
                                `${day.eatingWindow.start} - ${day.eatingWindow.end}` : 
                                'Standard window'}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Your plan follows the same schedule every day.
              </Typography>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Plan Last Updated
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {fastingPlan.updatedAt ? 
                formatTime(fastingPlan.updatedAt.toDate(), 'MMMM d, yyyy') : 
                'Not available'}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                onClick={() => navigate('/check-in')}
              >
                Daily Check-in
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                Regular check-ins help optimize your plan
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PlanPage;

