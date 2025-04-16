// src/pages/DashboardPage.jsx
import { Typography, CircularProgress, Box } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchHouses } from '../store/slices/houseSlice';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { houses, loading } = useSelector((state) => state.houses);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchHouses());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!loading && isAuthenticated && houses.length === 0) {
      navigate('/setup-house');
    }
  }, [houses, loading, navigate, isAuthenticated]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4">Dashboard</Typography>
      {/* Add your dashboard content here */}
    </div>
  );
}