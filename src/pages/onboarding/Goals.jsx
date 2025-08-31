import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  FitnessCenter as FitnessCenterIcon,
  Bolt as BoltIcon,
  Spa as SpaIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { saveUserProfile, getUserProfile } from '../../services/user';

const steps = ['Basic Info', 'Goals', 'Schedule'];

const GoalCard = ({ icon, title, description, value, selectedValue, onChange }) => {
  return (
    <Card 
      variant="outlined" 
      sx={{ 
        cursor: 'pointer',
        height: '100%',
        borderColor: selectedValue === value ? 'primary.main' : 'divider',
        borderWidth: selectedValue === value ? 2 : 1,
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: 1
        }
      }}
      onClick={() => onChange(value)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.light',
            color: 'primary.dark',
            borderRadius: '50%',
            width: 40,
            height: 40,
            mr: 2
          }}>
            {icon}
          </Box>
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Goals = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [goal, setGoal] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          setUserProfile(profile);
          
          // If user has already completed this step, pre-fill the form
          if (profile && profile.goal) {
            setGoal(profile.goal);
          }
          
          if (profile && profile.fastingExperience) {
            setExperience(profile.fastingExperience);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    
    fetchUserProfile();
  }, [currentUser]);
  
  const handleNext = async () => {
    // Validate inputs
    if (!goal) {
      setError('Please select your primary goal');
      return;
    }
    
    if (!experience) {
      setError('Please select your fasting experience level');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // Save user goals to Firestore
      if (currentUser) {
        await saveUserProfile(currentUser.uid, {
          goal,
          fastingExperience: experience,
          onboardingStep: 2 // Mark second step as completed
        });
      }
      
      // Navigate to next step
      navigate('/onboarding/schedule');
    } catch (error) {
      console.error("Error saving goals:", error);
      setError(error.message || 'Failed to save your goals. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBack = () => {
    navigate('/onboarding');
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Your Fasting Goals
        </Typography>
        
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Select your primary goal to help us create the right fasting plan for you
        </Typography>
        
        <Stepper activeStep={1} sx={{ mb: 4 }}>
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
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            What is your primary goal?
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <GoalCard
                icon={<FitnessCenterIcon />}
                title="Fat Loss"
                description="Focus on reducing body fat while preserving muscle mass through optimized fasting windows."
                value="fat_loss"
                selectedValue={goal}
                onChange={setGoal}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <GoalCard
                icon={<BoltIcon />}
                title="Energy & Focus"
                description="Enhance mental clarity and energy levels through strategic fasting protocols."
                value="energy"
                selectedValue={goal}
                onChange={setGoal}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <GoalCard
                icon={<SpaIcon />}
                title="Gut Health"
                description="Improve digestive health and reduce inflammation with gut-focused fasting schedules."
                value="gut_health"
                selectedValue={goal}
                onChange={setGoal}
              />
            </Grid>
          </Grid>
          
          <FormControl component="fieldset" sx={{ mt: 3, width: '100%' }}>
            <FormLabel component="legend">What is your experience with intermittent fasting?</FormLabel>
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
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={loading}
            >
              Back
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Goals;

