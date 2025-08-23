import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { 
  FamilyRestroom, 
  Person, 
  School, 
  Park, 
  FitnessCenter, 
  Bedtime, 
  People 
} from '@mui/icons-material';

// Define the activities with their details
const activityOptions = [
  { 
    id: 'family-time', 
    name: 'Family Time', 
    icon: <FamilyRestroom fontSize="large" />, 
    description: 'Spend quality time with your family members',
    points: 10,
    benefits: 'Strengthens family bonds and improves emotional well-being'
  },
  { 
    id: 'me-time', 
    name: 'Me Time', 
    icon: <Person fontSize="large" />, 
    description: 'Take time for yourself to relax and recharge',
    points: 5,
    benefits: 'Reduces stress and improves mental health'
  },
  { 
    id: 'learning', 
    name: 'Learning', 
    icon: <School fontSize="large" />, 
    description: 'Learn something new or improve existing skills',
    points: 15,
    benefits: 'Keeps your mind sharp and expands your knowledge'
  },
  { 
    id: 'nature-walk', 
    name: 'Nature Walk', 
    icon: <Park fontSize="large" />, 
    description: 'Take a walk in nature and enjoy the outdoors',
    points: 8,
    benefits: 'Improves mood and provides physical exercise'
  },
  { 
    id: 'workout', 
    name: 'Workout', 
    icon: <FitnessCenter fontSize="large" />, 
    description: 'Engage in physical exercise or sports',
    points: 12,
    benefits: 'Improves physical health and boosts energy levels'
  },
  { 
    id: 'sleep-well', 
    name: 'Sleep Well', 
    icon: <Bedtime fontSize="large" />, 
    description: 'Get a full night of quality sleep',
    points: 8,
    benefits: 'Essential for overall health and cognitive function'
  },
  { 
    id: 'social-meetups', 
    name: 'Social Meetups', 
    icon: <People fontSize="large" />, 
    description: 'Meet friends or participate in community events',
    points: 10,
    benefits: 'Builds social connections and prevents isolation'
  }
];

function ActivitiesPage() {
  const [completedActivities, setCompletedActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCompleteActivity = () => {
    if (selectedActivity && !completedActivities.includes(selectedActivity.id)) {
      setCompletedActivities([...completedActivities, selectedActivity.id]);
      
      // Store in localStorage for persistence and scoring
      const storedActivities = JSON.parse(localStorage.getItem('completedActivities') || '[]');
      const updatedActivities = [...storedActivities, {
        id: selectedActivity.id,
        name: selectedActivity.name,
        points: selectedActivity.points,
        completedAt: new Date().toISOString()
      }];
      localStorage.setItem('completedActivities', JSON.stringify(updatedActivities));
    }
    setDialogOpen(false);
  };

  const isActivityCompleted = (activityId) => {
    return completedActivities.includes(activityId);
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Activities
      </Typography>
      <Typography variant="subtitle1" paragraph>
        Complete these activities to improve your well-being and earn points.
      </Typography>
      
      <Grid container spacing={3}>
        {activityOptions.map((activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity.id}>
            <Card 
              elevation={3} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                opacity: isActivityCompleted(activity.id) ? 0.8 : 1,
                bgcolor: isActivityCompleted(activity.id) ? 'rgba(76, 175, 80, 0.1)' : 'white'
              }}
            >
              {isActivityCompleted(activity.id) && (
                <Chip 
                  label="Completed" 
                  color="success" 
                  size="small"
                  sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10,
                    zIndex: 1
                  }} 
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {activity.icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom align="center">
                  {activity.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activity.description}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Chip label={`${activity.points} points`} color="primary" />
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  fullWidth 
                  variant="contained" 
                  color={isActivityCompleted(activity.id) ? "success" : "primary"}
                  onClick={() => handleActivityClick(activity)}
                  disabled={isActivityCompleted(activity.id)}
                >
                  {isActivityCompleted(activity.id) ? "Completed" : "Complete Activity"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Activity Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{selectedActivity?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedActivity?.description}
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Benefits:</Typography>
            <DialogContentText>
              {selectedActivity?.benefits}
            </DialogContentText>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Points:</Typography>
            <DialogContentText>
              Completing this activity will earn you {selectedActivity?.points} points.
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCompleteActivity} variant="contained" color="primary">
            Mark as Completed
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ActivitiesPage;

