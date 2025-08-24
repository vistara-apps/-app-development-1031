import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Schedule,
  Refresh,
  Phone
} from '@mui/icons-material';

// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    client: 'Emma Johnson',
    service: 'Haircut & Style',
    date: '2025-08-24',
    time: '10:00 AM',
    status: 'confirmed',
    phone: '(555) 123-4567',
    rebookEligible: false
  },
  {
    id: 2,
    client: 'Michael Smith',
    service: 'Beard Trim',
    date: '2025-08-24',
    time: '11:30 AM',
    status: 'confirmed',
    phone: '(555) 234-5678',
    rebookEligible: false
  },
  {
    id: 3,
    client: 'Sophia Williams',
    service: 'Color & Highlights',
    date: '2025-08-24',
    time: '1:15 PM',
    status: 'pending',
    phone: '(555) 345-6789',
    rebookEligible: false
  },
  {
    id: 4,
    client: 'James Brown',
    service: 'Facial',
    date: '2025-08-24',
    time: '3:00 PM',
    status: 'cancelled',
    phone: '(555) 456-7890',
    rebookEligible: false
  },
  {
    id: 5,
    client: 'Olivia Davis',
    service: 'Manicure & Pedicure',
    date: '2025-08-25',
    time: '9:30 AM',
    status: 'confirmed',
    phone: '(555) 567-8901',
    rebookEligible: false
  },
  {
    id: 6,
    client: 'William Miller',
    service: 'Haircut',
    date: '2025-08-25',
    time: '11:00 AM',
    status: 'confirmed',
    phone: '(555) 678-9012',
    rebookEligible: false
  },
  {
    id: 7,
    client: 'Ava Wilson',
    service: 'Hair Coloring',
    date: '2025-08-25',
    time: '2:00 PM',
    status: 'pending',
    phone: '(555) 789-0123',
    rebookEligible: false
  }
];

// Mock data for rebooking opportunities
const mockRebookings = [
  {
    id: 101,
    client: 'Liam Johnson',
    lastService: 'Haircut & Style',
    lastVisit: '2025-07-24',
    phone: '(555) 890-1234',
    rebookEligible: true
  },
  {
    id: 102,
    client: 'Charlotte Brown',
    lastService: 'Color & Highlights',
    lastVisit: '2025-07-26',
    phone: '(555) 901-2345',
    rebookEligible: true
  },
  {
    id: 103,
    client: 'Noah Williams',
    lastService: 'Beard Trim',
    lastVisit: '2025-07-28',
    phone: '(555) 012-3456',
    rebookEligible: true
  },
  {
    id: 104,
    client: 'Amelia Davis',
    lastService: 'Manicure & Pedicure',
    lastVisit: '2025-07-30',
    phone: '(555) 123-4567',
    rebookEligible: true
  }
];

function AppointmentsPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'confirmed':
        return <Chip icon={<CheckCircle />} label="Confirmed" color="success" size="small" />;
      case 'pending':
        return <Chip icon={<Schedule />} label="Pending" color="warning" size="small" />;
      case 'cancelled':
        return <Chip icon={<Cancel />} label="Cancelled" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Appointments & Rebookings
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="appointment tabs">
          <Tab label="Upcoming Appointments" />
          <Tab label="Rebooking Opportunities" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.client}</TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{getStatusChip(appointment.status)}</TableCell>
                  <TableCell>
                    <Tooltip title="Call Client">
                      <IconButton size="small" color="primary">
                        <Phone />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Last Service</TableCell>
                <TableCell>Last Visit</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockRebookings.map((rebooking) => (
                <TableRow key={rebooking.id}>
                  <TableCell>{rebooking.client}</TableCell>
                  <TableCell>{rebooking.lastService}</TableCell>
                  <TableCell>{rebooking.lastVisit}</TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small" 
                      startIcon={<Refresh />}
                      sx={{ mr: 1 }}
                    >
                      Rebook
                    </Button>
                    <Tooltip title="Call Client">
                      <IconButton size="small" color="primary">
                        <Phone />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default AppointmentsPage;

