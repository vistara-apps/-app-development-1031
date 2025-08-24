import React from 'react'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          TechBuddy
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/device-setup">Device Setup</Button>
        <Button color="inherit" component={Link} to="/app-config">App Config</Button>
        <Button color="inherit" component={Link} to="/messaging">Messaging</Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
