import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { SUBSCRIPTION_TIERS } from '../services/subscription';
import { getFeatureComparison } from '../utils/featureAccess';
import { updateUserSubscription } from '../services/subscription';

const Paywall = ({ onUpgrade, onClose }) => {
  const { currentUser, subscription, updateSubscription } = useAuth();
  const featureComparison = getFeatureComparison();
  
  const handleUpgrade = async () => {
    try {
      // In a real app, this would integrate with a payment processor
      // For this demo, we'll just update the subscription status
      const updatedSubscription = await updateUserSubscription(
        currentUser.uid, 
        SUBSCRIPTION_TIERS.PREMIUM,
        {
          startDate: new Date().toISOString(),
          plan: 'monthly',
          price: 9.99
        }
      );
      
      updateSubscription(updatedSubscription);
      
      if (onUpgrade) {
        onUpgrade();
      }
    } catch (error) {
      console.error("Error upgrading subscription:", error);
    }
  };
  
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Upgrade to FastFlow Premium
      </Typography>
      
      <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
        Unlock advanced features to enhance your fasting journey
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Free Plan */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Free Plan
              </Typography>
              
              <Typography variant="h3" component="div" color="text.primary" sx={{ mb: 2 }}>
                $0
                <Typography variant="body2" component="span" color="text.secondary">
                  /month
                </Typography>
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <List dense>
                {featureComparison.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {feature.free === 'Yes' ? (
                        <CheckIcon color="success" fontSize="small" />
                      ) : (
                        <CloseIcon color="error" fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature.feature} 
                      secondary={typeof feature.free !== 'boolean' && feature.free !== 'Yes' && feature.free !== 'No' ? feature.free : null}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button 
                fullWidth 
                variant="outlined" 
                color="primary"
                disabled={subscription?.tier === SUBSCRIPTION_TIERS.FREE}
              >
                {subscription?.tier === SUBSCRIPTION_TIERS.FREE ? 'Current Plan' : 'Downgrade'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Premium Plan */}
        <Grid item xs={12} md={6}>
          <Card 
            variant="outlined" 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              border: theme => `2px solid ${theme.palette.primary.main}`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Box sx={{ bgcolor: 'primary.main', py: 1 }}>
              <Typography variant="subtitle1" align="center" color="white">
                RECOMMENDED
              </Typography>
            </Box>
            
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Premium Plan
              </Typography>
              
              <Typography variant="h3" component="div" color="primary" sx={{ mb: 2 }}>
                $9.99
                <Typography variant="body2" component="span" color="text.secondary">
                  /month
                </Typography>
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <List dense>
                {featureComparison.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature.feature} 
                      secondary={typeof feature.premium !== 'boolean' && feature.premium !== 'Yes' && feature.premium !== 'No' ? feature.premium : null}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button 
                fullWidth 
                variant="contained" 
                color="primary"
                onClick={handleUpgrade}
                disabled={subscription?.tier === SUBSCRIPTION_TIERS.PREMIUM}
              >
                {subscription?.tier === SUBSCRIPTION_TIERS.PREMIUM ? 'Current Plan' : 'Upgrade Now'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      
      {onClose && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button onClick={onClose} color="inherit">
            Maybe Later
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Paywall;

