import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress,
  IconButton,
  Paper,
  Stack
} from '@mui/material';
import {
  Mic as MicIcon,
  Stop as StopIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { saveVoiceJournal } from '../services/journal';
import { isFeatureAvailable } from '../utils/featureAccess';

const VoiceRecorder = ({ onSave, disabled = false }) => {
  const { currentUser, subscription } = useAuth();
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState('');
  
  // Check if user has access to voice journal feature
  const hasAccess = subscription && isFeatureAvailable(subscription.tier, 'voiceJournal');
  
  // Initialize audio player when audioUrl changes
  useEffect(() => {
    if (audioUrl) {
      const audioElement = new Audio(audioUrl);
      audioElement.addEventListener('ended', () => setPlaying(false));
      setAudio(audioElement);
      
      return () => {
        audioElement.pause();
        audioElement.removeEventListener('ended', () => setPlaying(false));
      };
    }
  }, [audioUrl]);
  
  // Update recording timer
  useEffect(() => {
    let interval;
    
    if (recording) {
      interval = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recording]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      
      recorder.ondataavailable = e => {
        chunks.push(e.data);
        setAudioChunks([...chunks]);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      
      // Stop all audio tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const togglePlayback = () => {
    if (!audio) return;
    
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };
  
  const deleteRecording = () => {
    if (audio) {
      audio.pause();
    }
    
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioChunks([]);
    setPlaying(false);
    setTranscription('');
  };
  
  const handleSave = async () => {
    if (!audioBlob || !currentUser) return;
    
    setLoading(true);
    try {
      const journalEntry = await saveVoiceJournal(currentUser.uid, audioBlob);
      setTranscription(journalEntry.text);
      
      if (onSave) {
        onSave(journalEntry);
      }
    } catch (error) {
      console.error("Error saving voice journal:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Format recording time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  if (!hasAccess) {
    return (
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, mb: 3 }}>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          Voice journaling is a premium feature. Upgrade to access.
        </Typography>
      </Paper>
    );
  }
  
  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Voice Journal
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Record your thoughts about your fasting experience today.
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 3 }}>
            {!audioBlob ? (
              <>
                <IconButton
                  color={recording ? 'error' : 'primary'}
                  aria-label={recording ? 'Stop recording' : 'Start recording'}
                  onClick={recording ? stopRecording : startRecording}
                  disabled={disabled}
                  sx={{ 
                    width: 80, 
                    height: 80,
                    border: theme => `2px solid ${recording ? theme.palette.error.main : theme.palette.primary.main}`,
                    '&:hover': {
                      backgroundColor: theme => recording ? 'rgba(211, 47, 47, 0.04)' : 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  {recording ? <StopIcon fontSize="large" /> : <MicIcon fontSize="large" />}
                </IconButton>
                
                {recording && (
                  <Typography variant="h6" color="error" sx={{ ml: 2 }}>
                    {formatTime(recordingTime)}
                  </Typography>
                )}
              </>
            ) : (
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton
                  color="primary"
                  onClick={togglePlayback}
                  sx={{ 
                    width: 60, 
                    height: 60,
                    border: '2px solid',
                    borderColor: 'primary.main'
                  }}
                >
                  {playing ? <PauseIcon /> : <PlayIcon />}
                </IconButton>
                
                <IconButton
                  color="error"
                  onClick={deleteRecording}
                  sx={{ 
                    width: 60, 
                    height: 60,
                    border: '2px solid',
                    borderColor: 'error.main'
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            )}
          </Box>
          
          {audioBlob && !transcription && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={disabled}
              >
                Save Journal Entry
              </Button>
            </Box>
          )}
          
          {transcription && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Transcription:
              </Typography>
              <Typography variant="body1">
                {transcription}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default VoiceRecorder;

