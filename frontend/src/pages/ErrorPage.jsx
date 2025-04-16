// src/pages/NotFoundPage.jsx
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h1" gutterBottom>404</Typography>
      <Typography variant="h4" gutterBottom>Page Not Found</Typography>
      <Button component={Link} to="/" variant="contained">
        Return to Dashboard
      </Button>
    </Box>
  );
}