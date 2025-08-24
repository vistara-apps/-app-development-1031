import React from 'react'
import { Container, Typography, Grid, Paper, Button, Box } from '@mui/material'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Welcome to TechBuddy
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5">Guided Device Setup</Typography>
            <Typography paragraph>
              We help seniors navigate new technology with easy, step-by-step guides.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/device-setup"
            >
              Start Setup
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5">App Configuration</Typography>
            <Typography paragraph>
              Customize your device for comfort and ease of use.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/app-config"
            >
              Configure
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5">Follow-up Messaging</Typography>
            <Typography paragraph>
              Automated, personalized post-appointment communication to ensure continued success.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/messaging"
            >
              Manage Messages
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          New Feature: Automated Follow-up System
        </Typography>
        <Typography paragraph>
          Our new messaging system helps maintain the connection with users after appointments. 
          The system automatically sends personalized follow-ups, reminders about what was covered, 
          and helpful tips based on the device type.
        </Typography>
        <Typography>
          This ensures users get the most out of their technology and have continued support 
          as they practice their new skills.
        </Typography>
      </Box>
    </Container>
  )
}

export default HomePage
