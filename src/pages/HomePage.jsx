import React from 'react'
import { Container, Typography, Grid, Paper } from '@mui/material'

function HomePage() {
  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Welcome to TechBuddy
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5">Guided Device Setup</Typography>
            <Typography>
              We help seniors navigate new technology with easy, step-by-step guides.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5">App Configuration</Typography>
            <Typography>
              Customize your device for comfort and ease of use.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default HomePage