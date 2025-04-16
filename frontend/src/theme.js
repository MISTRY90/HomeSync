// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#20c997',
      contrastText: '#fff',
    },
    secondary: {
      main: '#087f5b',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    button: {
      textTransform: 'none'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;