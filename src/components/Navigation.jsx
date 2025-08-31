import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Timer as TimerIcon,
  Assessment as AssessmentIcon,
  Book as JournalIcon,
  Settings as SettingsIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  RestaurantMenu as MealIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../services/auth';

const Navigation = () => {
  const { currentUser, userProfile } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      handleProfileMenuClose();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  const navItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Timer', path: '/timer', icon: <TimerIcon /> },
    { text: 'Progress', path: '/progress', icon: <AssessmentIcon /> },
    { text: 'Journal', path: '/journal', icon: <JournalIcon /> },
    { text: 'Plan', path: '/plan', icon: <MealIcon /> }
  ];
  
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        FastFlow
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            component={Link} 
            to={item.path} 
            key={item.text}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {!currentUser ? (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemIcon><LoginIcon /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/signup">
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/settings">
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );
  
  return (
    <>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ 
              flexGrow: 1, 
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            FastFlow
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex' }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{ 
                    mx: 1,
                    borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                    borderRadius: 0,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          
          {currentUser ? (
            <Box sx={{ ml: 2 }}>
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                aria-controls="profile-menu"
                aria-haspopup="true"
              >
                <Avatar 
                  alt={userProfile?.displayName || currentUser.displayName || 'User'} 
                  src={userProfile?.photoURL || currentUser.photoURL}
                  sx={{ width: 40, height: 40 }}
                />
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem component={Link} to="/profile" onClick={handleProfileMenuClose}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to="/settings" onClick={handleProfileMenuClose}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ mr: 1 }}
              >
                Login
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                component={Link} 
                to="/signup"
                sx={{ 
                  borderColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white'
                  }
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;

