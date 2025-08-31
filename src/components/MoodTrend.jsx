import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ProgressChart from './ProgressChart';
import { generateMoodTrendData } from '../utils/statsCalculator';

const MoodTrend = ({ checkIns, days = 7 }) => {
  // Generate chart data from check-ins
  const chartData = generateMoodTrendData(checkIns, days);
  
  // Check if there's any data to display
  const hasData = checkIns && checkIns.length > 0;
  
  return (
    <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Mood & Energy Trends
        </Typography>
        
        {hasData ? (
          <ProgressChart 
            data={chartData}
            type="line"
            yAxisLabel="Rating (1-5)"
            height={250}
          />
        ) : (
          <Box 
            sx={{ 
              height: 250, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'background.default',
              borderRadius: 1
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Complete daily check-ins to see your mood trends
            </Typography>
          </Box>
        )}
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Track how your mood and energy levels change throughout your fasting journey.
            Regular check-ins help the AI personalize your fasting plan.
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default MoodTrend;

