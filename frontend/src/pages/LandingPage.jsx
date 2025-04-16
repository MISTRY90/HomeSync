// src/pages/LandingPage.jsx
import { Box, Button, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Welcome to HomeSync
        </Typography>
        <Typography variant="h6" gutterBottom>
          Smart Home Automation Made Simple
        </Typography>
        <Box sx={{ mt: 4, gap: 2, display: 'flex', justifyContent: 'center' }}>
          <Button component={Link} to="/login" variant="contained" size="large">
            Get Started
          </Button>
        </Box>
      </Box>
    </Container>
  );
}