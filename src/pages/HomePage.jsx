import React from 'react'
import { Container, Typography, Grid, Paper, Button } from '@mui/material'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <Container>
      <Typography variant="h3" gutterBottom sx={{ mt: 3 }}>
        Welcome to TechBuddy
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: '20px', height: '100%' }}>
            <Typography variant="h5" gutterBottom>Guided Device Setup</Typography>
            <Typography paragraph>
              We help seniors navigate new technology with easy, step-by-step guides.
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="/device-setup"
              sx={{ mt: 2 }}
            >
              Setup Device
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: '20px', height: '100%' }}>
            <Typography variant="h5" gutterBottom>App Configuration</Typography>
            <Typography paragraph>
              Customize your device for comfort and ease of use.
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="/app-config"
              sx={{ mt: 2 }}
            >
              Configure Apps
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: '20px', height: '100%' }}>
            <Typography variant="h5" gutterBottom>Booking Integration</Typography>
            <Typography paragraph>
              Connect with popular salon booking platforms to automate appointment rebooking.
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="/booking-integration"
              sx={{ mt: 2 }}
            >
              Manage Bookings
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default HomePage
