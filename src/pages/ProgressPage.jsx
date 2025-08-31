import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import WeeklyStats from '../components/WeeklyStats';
import ProgressChart from '../components/ProgressChart';
import MoodTrend from '../components/MoodTrend';
import Paywall from '../components/Paywall';
import { getFastingHistory, getWeeklyFastingStats } from '../services/fastingPlan';
import { getCheckInHistory, getMoodTrend } from '../services/checkIn';
import { generateDailyFastingData } from '../utils/statsCalculator';
import { isFeatureAvailable } from '../utils/featureAccess';

const ProgressPage = () => {
  const navigate = useNavigate();
  const { currentUser, subscription } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [fastingSessions, setFastingSessions] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  
  // Check if user has access to advanced analytics
  const hasAdvancedAccess = subscription && isFeatureAvailable(subscription.tier, 'advancedAnalytics');
  
  // Fetch progress data
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        // Fetch fasting history
        const sessions = await getFastingHistory(currentUser.uid, 14); // Get last 14 days
        setFastingSessions(sessions);
        
        // Fetch check-in history
        const checkInData = await getCheckInHistory(currentUser.uid, 14);
        setCheckIns(checkInData);
        
        // Fetch weekly stats
        const weeklyStats = await getWeeklyFastingStats(currentUser.uid);
        setStats(weeklyStats);
        
        // Generate chart data
        const data = generateDailyFastingData(sessions, 7);
        setChartData(data);
      } catch (error) {
        console.error("Error fetching progress data:", error);
        setError('Failed to load your progress data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser, navigate]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Progress Tracking
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <WeeklyStats stats={stats} subscription={subscription} />
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Fasting History" />
        <Tab label="Mood & Energy" />
        {hasAdvancedAccess && <Tab label="Advanced Analytics" />}
      </Tabs>
      
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom>
                Daily Fasting Hours
              </Typography>
              
              {chartData && chartData.labels.length > 0 ? (
                <ProgressChart 
                  data={chartData}
                  type="bar"
                  yAxisLabel="Hours"
                  height={300}
                />
              ) : (
                <Box sx={{ 
                  height: 300, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'background.default',
                  borderRadius: 1
                }}>
                  <Typography variant="body1" color="text.secondary">
                    No fasting data available yet. Start a fast to see your progress.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MoodTrend checkIns={checkIns} />
          </Grid>
        </Grid>
      )}
      
      {tabValue === 2 && hasAdvancedAccess && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom>
                Fasting Consistency
              </Typography>
              
              {/* Advanced analytics content */}
              <Typography variant="body1">
                Advanced analytics content will be displayed here.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom>
                Goal Progress
              </Typography>
              
              {/* Advanced analytics content */}
              <Typography variant="body1">
                Advanced analytics content will be displayed here.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {tabValue === 2 && !hasAdvancedAccess && (
        <Paywall />
      )}
    </Container>
  );
};

export default ProgressPage;

