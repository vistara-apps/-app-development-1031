import React from 'react'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import SpaIcon from '@mui/icons-material/Spa'

function Navigation() {
  return (
    <AppBar position="static">
      <Toolbar>
        <SpaIcon sx={{ mr: 1 }} />
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Salon Dashboard
        </Typography>
        <Button color="inherit" component={Link} to="/">Dashboard</Button>
        <Button color="inherit" component={Link} to="/appointments">Appointments</Button>
        <Button color="inherit" component={Link} to="/settings">Settings</Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
