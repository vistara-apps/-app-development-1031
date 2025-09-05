import React from 'react';
import { cn, formatDuration } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Mic, Square, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecordButtonProps {
  variant?: 'start' | 'stop' | 'idle';
  isRecording: boolean;
  duration: number;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
  className?: string;
}

export function RecordButton({
  variant = 'idle',
  isRecording,
  duration,
  onStart,
  onStop,
  disabled,
  className
}: RecordButtonProps) {
  const handleClick = () => {
    if (isRecording) {
      onStop();
    } else {
      onStart();
    }
  };

  if (isRecording) {
    return (
      <div className={cn('flex flex-col items-center space-y-2', className)}>
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Button
            variant="emergency"
            size="lg"
            onClick={handleClick}
            disabled={disabled}
            className="h-20 w-20 rounded-full p-0"
          >
            <Square className="h-8 w-8" />
          </Button>
          
          {/* Recording indicator */}
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-error animate-pulse" />
        </motion.div>
        
        <div className="text-center">
          <div className="text-lg font-mono font-bold text-error">
            {formatDuration(duration)}
          </div>
          <div className="text-sm text-gray-600">Recording...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center space-y-2', className)}>
      <Button
        variant="emergency"
        size="lg"
        onClick={handleClick}
        disabled={disabled}
        className="h-20 w-20 rounded-full p-0"
      >
        <Mic className="h-8 w-8" />
      </Button>
      
      <div className="text-center">
        <div className="text-sm font-medium text-gray-900">
          Emergency Record
        </div>
        <div className="text-xs text-gray-600">
          Tap to start recording
        </div>
      </div>
    </div>
  );
}

interface AlertButtonProps {
  variant?: 'show' | 'hide';
  onAlert: () => void;
  disabled?: boolean;
  className?: string;
}

export function AlertButton({
  variant = 'show',
  onAlert,
  disabled,
  className
}: AlertButtonProps) {
  return (
    <Button
      variant="secondary"
      onClick={onAlert}
      disabled={disabled}
      className={cn('flex items-center space-x-2', className)}
    >
      <AlertTriangle className="h-4 w-4" />
      <span>Alert Contacts</span>
    </Button>
  );
}
