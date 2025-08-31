import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Card, 
  CardContent,
  Chip
} from '@mui/material';
import { 
  PlayArrow as PlayIcon, 
  Stop as StopIcon, 
  Refresh as ResetIcon 
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { startFastingSession, endFastingSession, calculateFastingStatus } from '../services/timer';
import { formatDuration } from '../utils/timeUtils';

const FastingTimer = () => {
  const { currentUser, activeSession, updateActiveSession } = useAuth();
  const [status, setStatus] = useState({ active: false, elapsed: 0, elapsedHours: 0, elapsedMinutes: 0, statusText: 'Not fasting' });
  const [loading, setLoading] = useState(false);
  
  // Update timer every second when active
  useEffect(() => {
    let interval;
    
    if (activeSession && status.active) {
      interval = setInterval(() => {
        const newStatus = calculateFastingStatus(activeSession);
        setStatus(newStatus);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession, status.active]);
  
  // Initialize timer status when activeSession changes
  useEffect(() => {
    if (activeSession) {
      const initialStatus = calculateFastingStatus(activeSession);
      setStatus(initialStatus);
    } else {
      setStatus({ active: false, elapsed: 0, elapsedHours: 0, elapsedMinutes: 0, statusText: 'Not fasting' });
    }
  }, [activeSession]);
  
  const handleStartFasting = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const sessionId = await startFastingSession(currentUser.uid);
      const newSession = {
        id: sessionId,
        startTime: { toDate: () => new Date() },
        active: true
      };
      updateActiveSession(newSession);
      
      const newStatus = calculateFastingStatus(newSession);
      setStatus(newStatus);
    } catch (error) {
      console.error("Error starting fasting session:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStopFasting = async () => {
    if (!currentUser || !activeSession) return;
    
    setLoading(true);
    try {
      const sessionData = await endFastingSession(currentUser.uid);
      updateActiveSession(null);
      setStatus({ active: false, elapsed: 0, elapsedHours: 0, elapsedMinutes: 0, statusText: 'Not fasting' });
    } catch (error) {
      console.error("Error ending fasting session:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetFasting = async () => {
    if (!currentUser || !activeSession) return;
    
    setLoading(true);
    try {
      // End current session
      await endFastingSession(currentUser.uid);
      
      // Start new session
      const sessionId = await startFastingSession(currentUser.uid);
      const newSession = {
        id: sessionId,
        startTime: { toDate: () => new Date() },
        active: true
      };
      updateActiveSession(newSession);
      
      const newStatus = calculateFastingStatus(newSession);
      setStatus(newStatus);
    } catch (error) {
      console.error("Error resetting fasting session:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate progress percentage for circular progress
  const calculateProgress = () => {
    if (!status.active) return 0;
    
    // Default target: 16 hours (can be customized based on user's plan)
    const targetHours = 16;
    const targetMs = targetHours * 60 * 60 * 1000;
    const progress = Math.min(100, (status.elapsed / targetMs) * 100);
    
    return progress;
  };
  
  const progress = calculateProgress();
  
  return (
    <Card elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', maxWidth: 500, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Fasting Timer
          </Typography>
          
          <Chip 
            label={status.active ? 'Active' : 'Inactive'} 
            color={status.active ? 'success' : 'default'} 
            size="small"
            sx={{ mb: 2 }}
          />
        </Box>
        
        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mb: 3 }}>
          <CircularProgress
            variant="determinate"
            value={progress}
            size={200}
            thickness={4}
            sx={{ 
              color: theme => progress >= 100 ? theme.palette.success.main : theme.palette.primary.main,
              position: 'absolute',
              zIndex: 1
            }}
          />
          <CircularProgress
            variant="determinate"
            value={100}
            size={200}
            thickness={4}
            sx={{ color: theme => theme.palette.grey[200] }}
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
              flexDirection: 'column'
            }}
          >
            <Typography variant="h3" component="div" color="text.primary">
              {status.elapsedHours}:{status.elapsedMinutes < 10 ? `0${status.elapsedMinutes}` : status.elapsedMinutes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              hours:minutes
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="h6" align="center" gutterBottom>
          {status.statusText}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
          {!status.active ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayIcon />}
              onClick={handleStartFasting}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              Start Fast
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="error"
                startIcon={<StopIcon />}
                onClick={handleStopFasting}
                disabled={loading}
              >
                End Fast
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ResetIcon />}
                onClick={handleResetFasting}
                disabled={loading}
              >
                Reset
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FastingTimer;

