import React, { useState } from 'react'
import { 
  Container, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Button 
} from '@mui/material'

const deviceSetupSteps = [
  'Choose Your Device',
  'Basic Configuration',
  'Connectivity Setup',
  'Personalization'
]

function DeviceSetupPage() {
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  return (
    <Container>
      <Typography variant="h4">Device Setup Wizard</Typography>
      <Stepper activeStep={activeStep}>
        {deviceSetupSteps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <div>
        {activeStep === deviceSetupSteps.length ? (
          <Typography>Setup Complete!</Typography>
        ) : (
          <>
            <Typography variant="h6">
              {deviceSetupSteps[activeStep]}
            </Typography>
            
            <div>
              <Button 
                disabled={activeStep === 0} 
                onClick={handleBack}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNext}
              >
                {activeStep === deviceSetupSteps.length - 1 
                  ? 'Finish' 
                  : 'Next'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Container>
  )
}

export default DeviceSetupPage