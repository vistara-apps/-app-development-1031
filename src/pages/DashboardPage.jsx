import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  TrendingUp, 
  People, 
  EventAvailable, 
  AttachMoney 
} from '@mui/icons-material';

// Mock data for the dashboard
const mockData = {
  todayAppointments: 8,
  weeklyRevenue: '$2,450',
  monthlyClients: 124,
  rebookingRate: '68%',
  recentAppointments: [
    { id: 1, client: 'Emma Johnson', service: 'Haircut & Style', time: '10:00 AM' },
    { id: 2, client: 'Michael Smith', service: 'Beard Trim', time: '11:30 AM' },
    { id: 3, client: 'Sophia Williams', service: 'Color & Highlights', time: '1:15 PM' },
    { id: 4, client: 'James Brown', service: 'Facial', time: '3:00 PM' },
  ],
  popularServices: [
    { service: 'Haircut & Style', count: 42 },
    { service: 'Color & Highlights', count: 38 },
    { service: 'Manicure & Pedicure', count: 27 },
    { service: 'Facial Treatment', count: 23 },
  ]
};

function DashboardPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Salon Dashboard
      </Typography>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'primary.light',
              color: 'white',
            }}
          >
            <EventAvailable fontSize="large" />
            <Typography component="p" variant="h6">
              Today's Appointments
            </Typography>
            <Typography component="p" variant="h4">
              {mockData.todayAppointments}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'secondary.light',
              color: 'white',
            }}
          >
            <AttachMoney fontSize="large" />
            <Typography component="p" variant="h6">
              Weekly Revenue
            </Typography>
            <Typography component="p" variant="h4">
              {mockData.weeklyRevenue}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'success.light',
              color: 'white',
            }}
          >
            <People fontSize="large" />
            <Typography component="p" variant="h6">
              Monthly Clients
            </Typography>
            <Typography component="p" variant="h4">
              {mockData.monthlyClients}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'info.light',
              color: 'white',
            }}
          >
            <TrendingUp fontSize="large" />
            <Typography component="p" variant="h6">
              Rebooking Rate
            </Typography>
            <Typography component="p" variant="h4">
              {mockData.rebookingRate}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Detailed Information */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Today's Appointments" />
            <Divider />
            <CardContent>
              <List>
                {mockData.recentAppointments.map((appointment) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem>
                      <ListItemText
                        primary={appointment.client}
                        secondary={`${appointment.service} - ${appointment.time}`}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Popular Services" />
            <Divider />
            <CardContent>
              <List>
                {mockData.popularServices.map((service, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={service.service}
                        secondary={`${service.count} bookings this month`}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardPage;

