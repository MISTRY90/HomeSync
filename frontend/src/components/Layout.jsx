// src/components/Layout.jsx
import { AppBar, Toolbar, Typography, Container } from '@mui/material';

export default function Layout({ children }) {
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">HomeSync</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {children}
      </Container>
    </>
  );
}