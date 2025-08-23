import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import { 
  EmojiEvents, 
  TrendingUp, 
  CalendarToday,
  FamilyRestroom, 
  Person, 
  School, 
  Park, 
  FitnessCenter, 
  Bedtime, 
  People 
} from '@mui/icons-material';

// Activity icons mapping
const activityIcons = {
  'family-time': <FamilyRestroom />,
  'me-time': <Person />,
  'learning': <School />,
  'nature-walk': <Park />,
  'workout': <FitnessCenter />,
  'sleep-well': <Bedtime />,
  'social-meetups': <People />
};

// Activity names mapping
const activityNames = {
  'family-time': 'Family Time',
  'me-time': 'Me Time',
  'learning': 'Learning',
  'nature-walk': 'Nature Walk',
  'workout': 'Workout',
  'sleep-well': 'Sleep Well',
  'social-meetups': 'Social Meetups'
};

function ScoringPage() {
  const [completedActivities, setCompletedActivities] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Load completed activities from localStorage
    const storedActivities = JSON.parse(localStorage.getItem('completedActivities') || '[]');
    setCompletedActivities(storedActivities);
    
    // Calculate total points
    const points = storedActivities.reduce((sum, activity) => sum + activity.points, 0);
    setTotalPoints(points);
    
    // Calculate level and progress
    const newLevel = Math.floor(points / 50) + 1;
    setLevel(newLevel);
    setProgress((points % 50) * 2); // 2% per point for the current level (50 points = 100%)
    
    // Calculate streak (simplified version - in a real app, this would be more sophisticated)
    calculateStreak(storedActivities);
  }, []);

  const calculateStreak = (activities) => {
    if (activities.length === 0) {
      setStreakDays(0);
      return;
    }

    // Get unique dates when activities were completed
    const dates = activities.map(activity => {
      const date = new Date(activity.completedAt);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    });
    const uniqueDates = [...new Set(dates)];
    
    // Sort dates in descending order
    uniqueDates.sort().reverse();
    
    // Check for consecutive days (simplified)
    let streak = 1;
    const today = new Date();
    const todayString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    
    // If the most recent activity was today, count the streak
    if (uniqueDates[0] === todayString) {
      for (let i = 1; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i-1].split('-'));
        const prevDate = new Date(uniqueDates[i].split('-'));
        
        // Check if dates are consecutive
        const diffTime = Math.abs(currentDate - prevDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    } else {
      streak = 0; // Reset streak if no activity today
    }
    
    setStreakDays(streak);
  };

  // Group activities by date for the activity history
  const groupActivitiesByDate = () => {
    const grouped = {};
    
    completedActivities.forEach(activity => {
      const date = new Date(activity.completedAt).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(activity);
    });
    
    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA)) // Sort by date descending
      .slice(0, 10); // Show only the last 10 days with activities
  };

  // Calculate activity type distribution
  const calculateActivityDistribution = () => {
    const distribution = {};
    
    completedActivities.forEach(activity => {
      if (!distribution[activity.id]) {
        distribution[activity.id] = 0;
      }
      distribution[activity.id]++;
    });
    
    return distribution;
  };

  const activityDistribution = calculateActivityDistribution();
  const groupedActivities = groupActivitiesByDate();

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Your Wellness Score
      </Typography>
      
      {/* Score Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmojiEvents color="primary" fontSize="large" sx={{ mr: 2 }} />
                <Typography variant="h5">Total Points</Typography>
              </Box>
              <Typography variant="h3" align="center" color="primary">
                {totalPoints}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="secondary" fontSize="large" sx={{ mr: 2 }} />
                <Typography variant="h5">Current Level</Typography>
              </Box>
              <Typography variant="h3" align="center" color="secondary">
                {level}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={progress} color="secondary" />
                <Typography variant="body2" align="right" sx={{ mt: 0.5 }}>
                  {progress}% to Level {level + 1}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday color="success" fontSize="large" sx={{ mr: 2 }} />
                <Typography variant="h5">Activity Streak</Typography>
              </Box>
              <Typography variant="h3" align="center" color="success">
                {streakDays}
              </Typography>
              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                {streakDays > 0 
                  ? `${streakDays} consecutive day${streakDays > 1 ? 's' : ''} with activities!` 
                  : 'Complete an activity today to start a streak!'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Activity Distribution */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Activity Distribution
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          {Object.entries(activityDistribution).map(([activityId, count]) => (
            <Grid item xs={6} sm={4} md={3} key={activityId}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {activityIcons[activityId]}
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {activityNames[activityId]}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip 
                  label={`${count} time${count > 1 ? 's' : ''}`} 
                  color="primary" 
                  size="small" 
                  sx={{ mr: 1 }} 
                />
                <Typography variant="body2" color="text.secondary">
                  {Math.round((count / completedActivities.length) * 100)}%
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* Recent Activity History */}
      <Typography variant="h5" gutterBottom>
        Recent Activity History
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Activity</TableCell>
              <TableCell align="right">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedActivities.length > 0 ? (
              groupedActivities.map(([date, activities]) => (
                <React.Fragment key={date}>
                  <TableRow>
                    <TableCell 
                      colSpan={3} 
                      sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)', fontWeight: 'bold' }}
                    >
                      {date}
                    </TableCell>
                  </TableRow>
                  {activities.map((activity, index) => (
                    <TableRow key={`${date}-${activity.id}-${index}`}>
                      <TableCell></TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {activityIcons[activity.id]}
                          <Typography sx={{ ml: 1 }}>
                            {activity.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">+{activity.points}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No activities completed yet. Start completing activities to see your history!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Scoring Rules */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Scoring Rules
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="body1" paragraph>
          Earn points by completing wellness activities:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle1">Activity Points:</Typography>
              <Box sx={{ ml: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FamilyRestroom fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Family Time: 10 points</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Me Time: 5 points</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <School fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Learning: 15 points</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Park fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Nature Walk: 8 points</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Box sx={{ ml: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FitnessCenter fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Workout: 12 points</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Bedtime fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Sleep Well: 8 points</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <People fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">Social Meetups: 10 points</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1">Level Progression:</Typography>
        <Typography variant="body2" paragraph sx={{ ml: 2 }}>
          • Every 50 points earns you a new level<br />
          • Higher levels unlock special achievements and rewards
        </Typography>
        
        <Typography variant="subtitle1">Streaks:</Typography>
        <Typography variant="body2" paragraph sx={{ ml: 2 }}>
          • Complete at least one activity every day to maintain your streak<br />
          • Longer streaks may earn bonus points in future updates
        </Typography>
      </Paper>
    </Container>
  );
}

export default ScoringPage;

