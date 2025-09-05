import { useState, useRef, useCallback, useEffect } from 'react';
import { useAppStore } from '@/store';
import { supportsMediaRecording } from '@/lib/utils';
import toast from 'react-hot-toast';

export interface UseRecordingReturn {
  isRecording: boolean;
  duration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  isSupported: boolean;
  error: string | null;
}

export function useRecording(): UseRecordingReturn {
  const { recording, startRecording: startRecordingStore, stopRecording: stopRecordingStore } = useAppStore();
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isSupported = supportsMediaRecording();

  // Update duration timer
  useEffect(() => {
    if (recording.isRecording) {
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDuration(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [recording.isRecording]);

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError('Recording not supported on this device');
      toast.error('Recording not supported on this device');
      return;
    }

    try {
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false, // Audio only for privacy
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Recording error occurred');
        toast.error('Recording error occurred');
      };

      mediaRecorder.start(1000); // Collect data every second
      mediaRecorderRef.current = mediaRecorder;
      
      startRecordingStore();
      toast.success('Recording started');
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording');
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  }, [isSupported, startRecordingStore]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || !recording.isRecording) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        
        // Stop all tracks to release microphone
        if (mediaRecorderRef.current?.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => {
            track.stop();
          });
        }
        
        mediaRecorderRef.current = null;
        chunksRef.current = [];
        
        stopRecordingStore();
        toast.success('Recording stopped');
        resolve(blob);
      };

      mediaRecorderRef.current.stop();
    });
  }, [recording.isRecording, stopRecordingStore]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && recording.isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [recording.isRecording]);

  return {
    isRecording: recording.isRecording,
    duration,
    startRecording,
    stopRecording,
    isSupported,
    error,
  };
}
