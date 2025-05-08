// src/components/TimeCard.jsx
import { useState, useEffect } from 'react';
import { Typography, Stack, Paper } from '@mui/material';

export const TimeCard = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Stack spacing={1}>
        <Typography variant="subtitle2" color="text.secondary">
          Current Time
        </Typography>
        <Typography variant="h3">{formattedTime}</Typography>
        <Typography variant="body1">{formattedDate}</Typography>
      </Stack>
    </Paper>
  );
};