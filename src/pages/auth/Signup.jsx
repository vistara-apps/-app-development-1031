import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Container,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/auth';

const steps = ['Create Account', 'Personal Information'];

const Signup = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  const handleNext = () => {
    if (activeStep === 0) {
      // Validate first step
      if (!email || !validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }
      
      if (!password || !validatePassword(password)) {
        setError('Password must be at least 6 characters long');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      setError('');
      setActiveStep(1);
    } else {
      // Submit form
      handleSignup();
    }
  };
  
  const handleBack = () => {
    setActiveStep(0);
    setError('');
  };
  
  const handleSignup = async () => {
    if (!displayName) {
      setError('Please enter your name');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await registerUser(email, password, displayName);
      navigate('/onboarding');
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Create Account
        </Typography>
        
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Join FastFlow to start your personalized fasting journey
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
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
          {activeStep === 0 ? (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={email && !validateEmail(email)}
                helperText={email && !validateEmail(email) ? 'Please enter a valid email address' : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={password && !validatePassword(password)}
                helperText={password && !validatePassword(password) ? 'Password must be at least 6 characters long' : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword && password !== confirmPassword}
                helperText={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </>
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="displayName"
              label="Full Name"
              name="displayName"
              autoComplete="name"
              autoFocus
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                disabled={loading}
              >
                Back
              </Button>
            )}
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={loading}
              sx={{ ml: activeStep > 0 ? 'auto' : 0 }}
            >
              {activeStep === steps.length - 1 ? (loading ? 'Creating Account...' : 'Create Account') : 'Next'}
            </Button>
          </Box>
          
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" variant="body2">
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;

