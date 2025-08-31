import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#10b981',
      light: '#4ade80',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff', // White
      light: '#f5f5f5',
      dark: '#e0e0e0',
      contrastText: '#000000',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
    },
    divider: '#e0e0e0',
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
    info: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#000000',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#000000',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#000000',
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#000000',
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#000000',
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#000000',
    },
    body1: {
      fontSize: '1rem',
      color: '#000000',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#666666',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          backgroundColor: '#10b981',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#059669',
          },
        },
        outlined: {
          borderColor: '#10b981',
          color: '#10b981',
          '&:hover': {
            borderColor: '#059669',
            backgroundColor: 'rgba(16, 185, 129, 0.04)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#000000',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e0e0e0',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#666666',
          '&.Mui-selected': {
            color: '#000000',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: '#10b981',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#059669',
          },
        },
      },
    },
  },
});

export default theme;
