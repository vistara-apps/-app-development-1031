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
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import VoiceRecorder from '../components/VoiceRecorder';
import Paywall from '../components/Paywall';
import { getJournalHistory } from '../services/journal';
import { formatDate } from '../utils/timeUtils';
import { isFeatureAvailable } from '../utils/featureAccess';

const JournalPage = () => {
  const navigate = useNavigate();
  const { currentUser, subscription } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [journals, setJournals] = useState([]);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [audioElement, setAudioElement] = useState(null);
  
  // Check if user has access to voice journal feature
  const hasAccess = subscription && isFeatureAvailable(subscription.tier, 'voiceJournal');
  
  // Fetch journal entries
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      try {
        // Fetch journal history
        const journalEntries = await getJournalHistory(currentUser.uid);
        setJournals(journalEntries);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
        setError('Failed to load your journal entries. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser, navigate]);
  
  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [audioElement]);
  
  const handlePlayAudio = (audioUrl, journalId) => {
    if (playingAudio === journalId) {
      // Pause current audio
      if (audioElement) {
        audioElement.pause();
      }
      setPlayingAudio(null);
    } else {
      // Stop current audio if any
      if (audioElement) {
        audioElement.pause();
      }
      
      // Play new audio
      const audio = new Audio(audioUrl);
      audio.addEventListener('ended', () => setPlayingAudio(null));
      audio.play();
      
      setAudioElement(audio);
      setPlayingAudio(journalId);
    }
  };
  
  const handleJournalSaved = (newJournal) => {
    setJournals([newJournal, ...journals]);
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
        Voice Journal
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Record your thoughts about your fasting journey and track your progress over time.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {hasAccess ? (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <VoiceRecorder onSave={handleJournalSaved} subscription={subscription} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom>
                Journal History
              </Typography>
              
              {journals.length > 0 ? (
                <List>
                  {journals.map((journal, index) => (
                    <React.Fragment key={journal.id}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem
                        alignItems="flex-start"
                        secondaryAction={
                          journal.audioUrl && (
                            <IconButton 
                              edge="end" 
                              aria-label="play"
                              onClick={() => handlePlayAudio(journal.audioUrl, journal.id)}
                            >
                              {playingAudio === journal.id ? <PauseIcon /> : <PlayIcon />}
                            </IconButton>
                          )
                        }
                      >
                        <ListItemText
                          primary={formatDate(journal.timestamp.toDate(), 'MMMM d, yyyy')}
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {journal.text}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No journal entries yet. Start recording your thoughts!
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Paywall />
      )}
    </Container>
  );
};

export default JournalPage;

