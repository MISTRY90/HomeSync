// src/pages/DashboardPage.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  CircularProgress, 
  Box, 
  Grid,
  Paper,
  Stack,
  Switch,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchHouses, setCurrentHouse } from '../store/slices/houseSlice';
import { fetchEnergyAnalytics } from '../store/slices/analyticsSlice';
import { fetchDevices } from '../store/slices/deviceSlice';
import { Card } from '../components/Card';
import { TimeCard } from '../components/TimeCard';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Redux state selectors
  const { houses, currentHouse, loading: housesLoading } = useSelector((state) => state.houses);
  const { isAuthenticated, user: userId } = useSelector((state) => state.auth);
  const { devices, loading: devicesLoading } = useSelector((state) => state.devices);
  const { 
    summary, 
    averageDailyUsage,
    energyUsage,
    status: analyticsStatus,
    error: analyticsError
  } = useSelector((state) => state.analytics);

  useEffect(() => {
    if (isAuthenticated && userId) {
      dispatch(fetchHouses(userId));
    }
  }, [dispatch, isAuthenticated, userId]);

  useEffect(() => {
    if (!housesLoading && houses.length > 0) {
      if (!currentHouse) {
        dispatch(setCurrentHouse(houses[0]));
      }
      const houseId = currentHouse?.id || houses[0]?.id;
      if (houseId) {
        dispatch(fetchEnergyAnalytics(houseId));
        dispatch(fetchDevices(houseId));
      }
    }
  }, [dispatch, houses, currentHouse, housesLoading]);

  useEffect(() => {
    if (!housesLoading && isAuthenticated && houses.length === 0) {
      navigate('/setup-house');
    }
  }, [houses, housesLoading, navigate, isAuthenticated]);

  const handleDeviceToggle = (deviceId, newState) => {
    // Implement device state update logic here
    console.log(`Toggling device ${deviceId} to ${newState}`);
  };

  const loading = housesLoading || devicesLoading || analyticsStatus === 'loading';

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (analyticsError) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">Error loading analytics: {analyticsError}</Typography>
      </Box>
    );
  }

  const monthlyCost = summary?.reduce(
    (acc, curr) => acc + curr.cost, 0
  ).toFixed(2) || '0.00';

  // Sample energy data - replace with actual data from analytics
  const energyData = [
    { time: '12AM', power: 140 },
    { time: '3AM', power: 105 },
    { time: '6AM', power: 70 },
    { time: '9AM', power: 35 },
    { time: '12PM', power: 0 },
    { time: '3PM', power: 35 },
    { time: '6PM', power: 70 },
    { time: '9PM', power: 105 },
    { time: '12AM', power: 140 },
  ];

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      <Grid container spacing={3}>
        {/* Top Cards Row */}
        <Grid item xs={12} sm={6} lg={3}>
          <TimeCard />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            title="Energy Today"
            value={`${averageDailyUsage?.toFixed(1) || '0.0'} kWh`}
            comparison={{ percentage: 12, label: 'vs last day' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            title="Total Devices"
            value={devices.length}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            title="Monthly Cost"
            value={`$${monthlyCost}`}
            comparison={{ percentage: 8, label: 'vs last month' }}
          />
        </Grid>

        {/* Energy Usage Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Energy Usage Today
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis unit="W" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="power" 
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Quick Controls */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Quick Controls
            </Typography>
            <Stack spacing={2}>
              {devices.map((device) => (
                <Paper key={device.id} sx={{ p: 2 }}>
                  <Stack 
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center"
                  >
                    <div>
                      <Typography variant="subtitle1">{device.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {device.room}
                      </Typography>
                    </div>
                    <Switch
                      checked={device.state === 'on'}
                      onChange={(e) => handleDeviceToggle(device.id, e.target.checked ? 'on' : 'off')}
                      color="primary"
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}