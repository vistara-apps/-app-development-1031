import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  CircularProgress,
  Divider,
  Chip
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Equalizer as EqualizerIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { formatDuration } from '../utils/timeUtils';
import { isFeatureAvailable } from '../utils/featureAccess';

const StatCard = ({ title, value, icon, color = 'primary', suffix = '', prefix = '' }) => {
  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        mb: 1
      }}>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `${color}.light`,
          color: `${color}.dark`,
          borderRadius: '50%',
          width: 40,
          height: 40,
          mr: 1
        }}>
          {icon}
        </Box>
        <Typography variant="h6" component="h3" color="text.primary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>
        {prefix}{value}{suffix}
      </Typography>
    </Box>
  );
};

const FastingScoreCard = ({ score }) => {
  return (
    <Box sx={{ textAlign: 'center', p: 2, position: 'relative' }}>
      <Typography variant="h6" component="h3" gutterBottom>
        Weekly Fasting Score
      </Typography>
      
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={score}
          size={120}
          thickness={5}
          sx={{ 
            color: theme => {
              if (score >= 80) return theme.palette.success.main;
              if (score >= 60) return theme.palette.primary.main;
              if (score >= 40) return theme.palette.warning.main;
              return theme.palette.error.main;
            }
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {score}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <Chip 
          icon={<StarIcon />}
          label={
            score >= 80 ? 'Excellent' :
            score >= 60 ? 'Good' :
            score >= 40 ? 'Fair' :
            'Needs Improvement'
          }
          color={
            score >= 80 ? 'success' :
            score >= 60 ? 'primary' :
            score >= 40 ? 'warning' :
            'error'
          }
          size="small"
        />
      </Box>
    </Box>
  );
};

const WeeklyStats = ({ stats, subscription }) => {
  const { 
    totalSessions = 0, 
    completedSessions = 0, 
    totalHours = 0, 
    averageDuration = 0,
    fastingScore = 0
  } = stats || {};
  
  // Check if user has access to weekly fasting score
  const hasScoreAccess = subscription && isFeatureAvailable(subscription.tier, 'weeklyFastingScore');
  
  return (
    <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
      <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          Weekly Summary
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Total Hours" 
              value={totalHours.toFixed(1)} 
              icon={<TimeIcon />}
              suffix="h"
              color="primary"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Sessions" 
              value={completedSessions} 
              icon={<CalendarIcon />}
              suffix={`/${totalSessions}`}
              color="secondary"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title="Avg Duration" 
              value={averageDuration.toFixed(1)} 
              icon={<EqualizerIcon />}
              suffix="h"
              color="success"
            />
          </Grid>
          
          {hasScoreAccess ? (
            <Grid item xs={12} sm={6} md={3}>
              <FastingScoreCard score={fastingScore} />
            </Grid>
          ) : (
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 1
              }}>
                <StarIcon color="action" sx={{ mb: 1, opacity: 0.5 }} />
                <Typography variant="body2" color="text.secondary" align="center">
                  Fasting Score is a premium feature
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Paper>
  );
};

export default WeeklyStats;

