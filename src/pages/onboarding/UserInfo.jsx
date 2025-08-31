import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Container,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  InputAdornment,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { saveUserProfile } from '../../services/user';

const steps = ['Basic Info', 'Goals', 'Schedule'];

const UserInfo = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleNext = async () => {
    // Validate inputs
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
    setLoading(true);
    
    try {
      // Save user info to Firestore
      if (currentUser) {
        await saveUserProfile(currentUser.uid, {
          age: parseInt(age),
          gender,
          weight: parseFloat(weight),
          height: parseFloat(height),
          onboardingStep: 1 // Mark first step as completed
        });
      }
      
      // Navigate to next step
      navigate('/onboarding/goals');
    } catch (error) {
      console.error("Error saving user info:", error);
      setError(error.message || 'Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Welcome to FastFlow
        </Typography>
        
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Let's get to know you better to create your personalized fasting plan
        </Typography>
        
        <Stepper activeStep={0} sx={{ mb: 4 }}>
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
          <TextField
            margin="normal"
            required
            fullWidth
            id="age"
            label="Age"
            name="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            InputProps={{
              inputProps: { min: 18, max: 100 }
            }}
          />
          
          <FormControl component="fieldset" sx={{ mt: 3, width: '100%' }}>
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
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="weight"
            label="Weight"
            name="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            InputProps={{
              inputProps: { min: 30, max: 300, step: 0.1 },
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            sx={{ mt: 3 }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="height"
            label="Height"
            name="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            InputProps={{
              inputProps: { min: 100, max: 250, step: 0.1 },
              endAdornment: <InputAdornment position="end">cm</InputAdornment>,
            }}
          />
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={loading}
            sx={{ mt: 4, mb: 2, py: 1.5 }}
          >
            {loading ? 'Saving...' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserInfo;

