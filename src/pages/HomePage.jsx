import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Paper,
  Card,
  CardContent,
  CardMedia,
  Divider,
  useTheme
} from '@mui/material';
import { 
  Timer as TimerIcon,
  Assessment as AssessmentIcon,
  Psychology as PsychologyIcon,
  Spa as SpaIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FastingTimer from '../components/FastingTimer';

const FeatureCard = ({ icon, title, description }) => {
  const theme = useTheme();
  
  return (
    <Card elevation={0} sx={{ height: '100%', borderRadius: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2 
        }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.light',
            color: 'primary.dark',
            borderRadius: '50%',
            width: 48,
            height: 48,
            mr: 2
          }}>
            {icon}
          </Box>
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const HomePage = () => {
  const { currentUser, userProfile } = useAuth();
  const theme = useTheme();
  
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  mb: 2
                }}
              >
                Your Personal Fasting Assistant
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                FastFlow creates personalized intermittent fasting plans powered by AI to help you achieve your health goals.
              </Typography>
              
              {!currentUser ? (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="large"
                    component={RouterLink}
                    to="/signup"
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 600
                    }}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    size="large"
                    component={RouterLink}
                    to="/login"
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Login
                  </Button>
                </Box>
              ) : (
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  component={RouterLink}
                  to="/timer"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600
                  }}
                >
                  Go to Timer
                </Button>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    left: -20,
                    right: -20,
                    bottom: -20,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%',
                    zIndex: 0
                  }
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  {currentUser ? (
                    <FastingTimer />
                  ) : (
                    <img 
                      src="/timer-preview.png" 
                      alt="FastFlow Timer Preview" 
                      style={{ 
                        width: '100%', 
                        maxWidth: 500,
                        borderRadius: 16,
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ mb: 1 }}
        >
          Features
        </Typography>
        
        <Typography 
          variant="subtitle1" 
          align="center" 
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}
        >
          FastFlow combines the science of intermittent fasting with AI to create a personalized experience that adapts to your needs.
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard 
              icon={<TimerIcon />}
              title="Visual Timer"
              description="Track your fasting progress with a visual timer that shows your real-time status and progress."
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard 
              icon={<PsychologyIcon />}
              title="AI Coach"
              description="Get personalized fasting plans based on your goals, preferences, and daily feedback."
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard 
              icon={<AssessmentIcon />}
              title="Progress Tracking"
              description="Monitor your fasting journey with detailed statistics and visualizations of your progress."
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard 
              icon={<SpaIcon />}
              title="Voice Journal"
              description="Record your thoughts and feelings about your fasting experience with voice journaling."
            />
          </Grid>
        </Grid>
      </Container>
      
      {/* CTA Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="md">
          <Paper 
            elevation={0}
            sx={{ 
              p: 6, 
              borderRadius: 4,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
              color: 'white'
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              Start Your Fasting Journey Today
            </Typography>
            
            <Typography variant="subtitle1" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of users who have transformed their health with FastFlow's personalized fasting plans.
            </Typography>
            
            {!currentUser ? (
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                component={RouterLink}
                to="/signup"
                sx={{ 
                  px: 6,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600
                }}
              >
                Get Started for Free
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                component={RouterLink}
                to="/timer"
                sx={{ 
                  px: 6,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600
                }}
              >
                Go to Dashboard
              </Button>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;

