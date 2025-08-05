import React, { useState } from 'react'
import { 
  Container, 
  Typography, 
  Switch, 
  FormControlLabel, 
  Slider 
} from '@mui/material'

function AppConfigPage() {
  const [fontSize, setFontSize] = useState(16)
  const [highContrast, setHighContrast] = useState(false)

  return (
    <Container>
      <Typography variant="h4">App Accessibility Settings</Typography>
      
      <div style={{ marginTop: '20px' }}>
        <Typography gutterBottom>Font Size</Typography>
        <Slider
          value={fontSize}
          onChange={(e, newValue) => setFontSize(newValue)}
          min={12}
          max={24}
          valueLabelDisplay="auto"
        />
      </div>

      <FormControlLabel
        control={
          <Switch
            checked={highContrast}
            onChange={() => setHighContrast(!highContrast)}
          />
        }
        label="High Contrast Mode"
      />
    </Container>
  )
}

export default AppConfigPage