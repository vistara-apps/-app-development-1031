import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

const Button = ({ 
  children, 
  loading = false, 
  disabled = false, 
  startIcon, 
  endIcon,
  ...props 
}) => {
  return (
    <MuiButton
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      endIcon={endIcon}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;

