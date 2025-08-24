import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  scheduleFollowUpSequence, 
  getScheduledMessagesForUser, 
  sampleUsers 
} from '../services/messagingService';

function MessageManager() {
  const [scheduledMessages, setScheduledMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(sampleUsers[0]?.id || null);
  const [editedMessage, setEditedMessage] = useState({ body: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      loadUserMessages(selectedUser);
    }
  }, [selectedUser]);

  const loadUserMessages = async (userId) => {
    setLoading(true);
    try {
      const messages = await getScheduledMessagesForUser(userId);
      setScheduledMessages(messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (event) => {
    setSelectedUser(Number(event.target.value));
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleEditMessage = () => {
    setEditedMessage({
      ...selectedMessage.message,
      body: selectedMessage.message.body
    });
    setDialogOpen(false);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    // In a real app, this would update the message in the database
    const updatedMessages = scheduledMessages.map(msg => {
      if (msg.scheduledId === selectedMessage.scheduledId) {
        return {
          ...msg,
          message: {
            ...msg.message,
            body: editedMessage.body
          }
        };
      }
      return msg;
    });
    
    setScheduledMessages(updatedMessages);
    setEditDialogOpen(false);
  };

  const handleCancelEdit = () => {
    setEditDialogOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getMessageTypeLabel = (message) => {
    if (message.body.includes('How is your')) {
      return 'Follow-up';
    } else if (message.body.includes('reminder')) {
      return 'Reminder';
    } else if (message.body.includes('tip')) {
      return 'Tip';
    }
    return 'Message';
  };

  const getChipColor = (type) => {
    switch (type) {
      case 'Follow-up':
        return 'primary';
      case 'Reminder':
        return 'secondary';
      case 'Tip':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Automated Messaging System
      </Typography>
      <Typography variant="body1" paragraph>
        Manage personalized post-appointment follow-up messages
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="user-select-label">Select User</InputLabel>
        <Select
          labelId="user-select-label"
          value={selectedUser || ''}
          label="Select User"
          onChange={handleUserChange}
        >
          {sampleUsers.map(user => (
            <MenuItem key={user.id} value={user.id}>
              {user.name} ({user.preferredContactMethod})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Scheduled Messages
        </Typography>
        
        {loading ? (
          <Typography>Loading messages...</Typography>
        ) : scheduledMessages.length === 0 ? (
          <Typography>No scheduled messages found.</Typography>
        ) : (
          <List>
            {scheduledMessages.map((scheduledMsg, index) => {
              const messageType = getMessageTypeLabel(scheduledMsg.message);
              return (
                <React.Fragment key={scheduledMsg.scheduledId}>
                  {index > 0 && <Divider />}
                  <ListItem 
                    button 
                    onClick={() => handleMessageClick(scheduledMsg)}
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                  >
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', mb: 1 }}>
                      <Chip 
                        label={messageType} 
                        size="small" 
                        color={getChipColor(messageType)} 
                        sx={{ mr: 1 }} 
                      />
                      <Typography variant="caption">
                        Scheduled: {formatDate(scheduledMsg.scheduledTime)}
                      </Typography>
                    </Box>
                    <ListItemText
                      primary={scheduledMsg.message.method === 'email' ? scheduledMsg.message.subject : 'SMS Message'}
                      secondary={scheduledMsg.message.body.length > 100 
                        ? `${scheduledMsg.message.body.substring(0, 100)}...` 
                        : scheduledMsg.message.body}
                    />
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end', mt: 1 }}>
                      <Typography variant="caption">
                        To: {scheduledMsg.message.to} via {scheduledMsg.message.method.toUpperCase()}
                      </Typography>
                    </Box>
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Paper>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => loadUserMessages(selectedUser)}
        disabled={!selectedUser || loading}
      >
        Refresh Messages
      </Button>

      {/* Message Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Message Details
        </DialogTitle>
        <DialogContent>
          {selectedMessage && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Scheduled for: {formatDate(selectedMessage.scheduledTime)}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Delivery Method: {selectedMessage.message.method.toUpperCase()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Recipient: {selectedMessage.message.to}
              </Typography>
              
              {selectedMessage.message.method === 'email' && (
                <Typography variant="subtitle1" gutterBottom>
                  Subject: {selectedMessage.message.subject}
                </Typography>
              )}
              
              <Typography variant="subtitle1" gutterBottom>
                Message:
              </Typography>
              <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5', whiteSpace: 'pre-wrap' }}>
                {selectedMessage.message.body}
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditMessage} color="primary">
            Edit Message
          </Button>
          <Button onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Message Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCancelEdit} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Message
        </DialogTitle>
        <DialogContent>
          {editedMessage && (
            <Box sx={{ mt: 2 }}>
              {editedMessage.method === 'email' && (
                <TextField
                  label="Subject"
                  fullWidth
                  value={editedMessage.subject || ''}
                  onChange={(e) => setEditedMessage({...editedMessage, subject: e.target.value})}
                  margin="normal"
                />
              )}
              
              <TextField
                label="Message Body"
                fullWidth
                multiline
                rows={8}
                value={editedMessage.body || ''}
                onChange={(e) => setEditedMessage({...editedMessage, body: e.target.value})}
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MessageManager;

