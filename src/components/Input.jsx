import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

const Input = ({ 
  startIcon, 
  endIcon, 
  error, 
  helperText,
  ...props 
}) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      error={!!error}
      helperText={error || helperText}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">
            {startIcon}
          </InputAdornment>
        ) : null,
        endAdornment: endIcon ? (
          <InputAdornment position="end">
            {endIcon}
          </InputAdornment>
        ) : null
      }}
      {...props}
    />
  );
};

export default Input;

