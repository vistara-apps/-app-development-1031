import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'

function Navigation() {
  const location = useLocation();
  
  // Helper function to determine if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          TechBuddy
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            sx={{ 
              borderBottom: isActive('/') ? '2px solid white' : 'none',
              borderRadius: 0,
              mx: 0.5
            }}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/activities"
            sx={{ 
              borderBottom: isActive('/activities') ? '2px solid white' : 'none',
              borderRadius: 0,
              mx: 0.5
            }}
          >
            Activities
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/scoring"
            sx={{ 
              borderBottom: isActive('/scoring') ? '2px solid white' : 'none',
              borderRadius: 0,
              mx: 0.5
            }}
          >
            Scoring
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/device-setup"
            sx={{ 
              borderBottom: isActive('/device-setup') ? '2px solid white' : 'none',
              borderRadius: 0,
              mx: 0.5
            }}
          >
            Device Setup
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/app-config"
            sx={{ 
              borderBottom: isActive('/app-config') ? '2px solid white' : 'none',
              borderRadius: 0,
              mx: 0.5
            }}
          >
            App Config
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
