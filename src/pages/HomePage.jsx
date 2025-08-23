import React from 'react'
import { Container, Typography, Grid, Paper, Button, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { 
  FamilyRestroom, 
  Person, 
  School, 
  Park, 
  FitnessCenter, 
  Bedtime, 
  People,
  EmojiEvents
} from '@mui/icons-material'

function HomePage() {
  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Welcome to TechBuddy
      </Typography>
      
      <Grid container spacing={3}>
        {/* Featured Activities Section */}
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
            <Typography variant="h5" gutterBottom>
              Featured Activities
            </Typography>
            <Typography paragraph>
              Improve your well-being with these activities and earn points!
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <FamilyRestroom fontSize="large" color="primary" />
                  <Typography variant="body2">Family Time</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Person fontSize="large" color="primary" />
                  <Typography variant="body2">Me Time</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <School fontSize="large" color="primary" />
                  <Typography variant="body2">Learning</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Park fontSize="large" color="primary" />
                  <Typography variant="body2">Nature Walk</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <FitnessCenter fontSize="large" color="primary" />
                  <Typography variant="body2">Workout</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ textAlign: 'center' }}>
                  <Bedtime fontSize="large" color="primary" />
                  <Typography variant="body2">Sleep Well</Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/activities"
                startIcon={<People />}
              >
                View All Activities
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Scoring Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '20px', height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Track Your Progress
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmojiEvents color="primary" sx={{ mr: 1 }} />
              <Typography>
                Earn points and track your wellness journey.
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              color="primary" 
              component={Link} 
              to="/scoring"
              fullWidth
            >
              View Your Score
            </Button>
          </Paper>
        </Grid>
        
        {/* Original Sections */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '20px', height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Guided Device Setup
            </Typography>
            <Typography paragraph>
              We help seniors navigate new technology with easy, step-by-step guides.
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              component={Link} 
              to="/device-setup"
              fullWidth
            >
              Setup Device
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '20px', height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              App Configuration
            </Typography>
            <Typography paragraph>
              Customize your device for comfort and ease of use.
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              component={Link} 
              to="/app-config"
              fullWidth
            >
              Configure App
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default HomePage
