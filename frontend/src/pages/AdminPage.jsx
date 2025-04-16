// src/pages/AdminPage.jsx
import { Typography, Container, Box } from '@mui/material';

export default function AdminPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        {/* Add admin content */}
      </Box>
    </Container>
  );
}