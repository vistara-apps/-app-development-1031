import React from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  Stack,
  Slider,
  FormControl,
  FormLabel
} from '@mui/material';
import {
  SentimentVeryDissatisfied as VeryDissatisfiedIcon,
  SentimentDissatisfied as DissatisfiedIcon,
  SentimentNeutral as NeutralIcon,
  SentimentSatisfied as SatisfiedIcon,
  SentimentVerySatisfied as VerySatisfiedIcon
} from '@mui/icons-material';

// Custom icons for the mood rating
const customIcons = {
  1: {
    icon: <VeryDissatisfiedIcon fontSize="large" />,
    label: 'Very Poor',
  },
  2: {
    icon: <DissatisfiedIcon fontSize="large" />,
    label: 'Poor',
  },
  3: {
    icon: <NeutralIcon fontSize="large" />,
    label: 'Neutral',
  },
  4: {
    icon: <SatisfiedIcon fontSize="large" />,
    label: 'Good',
  },
  5: {
    icon: <VerySatisfiedIcon fontSize="large" />,
    label: 'Excellent',
  },
};

// Custom icon component for the rating
function IconContainer(props) {
  const { value, ...other } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mr: 2,
        ml: 2
      }}
      {...other}
    >
      {customIcons[value].icon}
      <Typography variant="caption" sx={{ mt: 1 }}>
        {customIcons[value].label}
      </Typography>
    </Box>
  );
}

const MoodSelector = ({ mood, setMood, energyLevel, setEnergyLevel, hungerLevel, setHungerLevel, sleepQuality, setSleepQuality }) => {
  return (
    <Stack spacing={4} sx={{ width: '100%', maxWidth: 600, mx: 'auto', my: 3 }}>
      <FormControl>
        <FormLabel id="mood-label" sx={{ mb: 2, fontWeight: 'bold' }}>How do you feel today?</FormLabel>
        <Rating
          name="mood-rating"
          value={mood}
          onChange={(event, newValue) => {
            setMood(newValue);
          }}
          IconContainerComponent={IconContainer}
          getLabelText={(value) => customIcons[value].label}
          highlightSelectedOnly
          sx={{ 
            '& .MuiRating-iconFilled': {
              color: 'primary.main',
            },
            '& .MuiRating-iconHover': {
              color: 'primary.light',
            },
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel id="energy-label" sx={{ mb: 1, fontWeight: 'bold' }}>Energy Level</FormLabel>
        <Box sx={{ px: 2 }}>
          <Slider
            aria-labelledby="energy-label"
            value={energyLevel}
            onChange={(event, newValue) => setEnergyLevel(newValue)}
            step={1}
            marks
            min={1}
            max={5}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => {
              const labels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
              return labels[value - 1];
            }}
          />
        </Box>
      </FormControl>

      <FormControl>
        <FormLabel id="hunger-label" sx={{ mb: 1, fontWeight: 'bold' }}>Hunger Level</FormLabel>
        <Box sx={{ px: 2 }}>
          <Slider
            aria-labelledby="hunger-label"
            value={hungerLevel}
            onChange={(event, newValue) => setHungerLevel(newValue)}
            step={1}
            marks
            min={1}
            max={5}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => {
              const labels = ['Not Hungry', 'Slightly Hungry', 'Moderately Hungry', 'Very Hungry', 'Extremely Hungry'];
              return labels[value - 1];
            }}
          />
        </Box>
      </FormControl>

      <FormControl>
        <FormLabel id="sleep-label" sx={{ mb: 1, fontWeight: 'bold' }}>Sleep Quality</FormLabel>
        <Box sx={{ px: 2 }}>
          <Slider
            aria-labelledby="sleep-label"
            value={sleepQuality}
            onChange={(event, newValue) => setSleepQuality(newValue)}
            step={1}
            marks
            min={1}
            max={5}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => {
              const labels = ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'];
              return labels[value - 1];
            }}
          />
        </Box>
      </FormControl>
    </Stack>
  );
};

export default MoodSelector;

