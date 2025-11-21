import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import WarningIcon from '@mui/icons-material/Warning';
import { fetchAttentionItems } from './api/attention';
import BooksIndex from './pages/BooksIndex';
import BookShow from './pages/BookShow';
import BooksNew from './pages/BooksNew';
import CoversIndex from './pages/CoversIndex';
import CoverShow from './pages/CoverShow';
import FormatsIndex from './pages/FormatsIndex';
import FormatShow from './pages/FormatShow';
import JobOrdersIndex from './pages/JobOrdersIndex';
import JobOrderShow from './pages/JobOrderShow';
import PrintExportsIndex from './pages/PrintExportsIndex';
import PrintExportShow from './pages/PrintExportShow';
import PrintQueueIndex from './pages/PrintQueueIndex';
import AttentionIndex from './pages/AttentionIndex';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5d4037', // Warm brown like aged leather
    },
    secondary: {
      main: '#8d6e63', // Lighter warm brown
    },
    background: {
      default: '#f5f1e8', // Cream/parchment color
      paper: '#ffffff', // White for cards to stand out
    },
    text: {
      primary: '#3e2723', // Deep brown
      secondary: '#6d4c41',
    },
  },
  typography: {
    fontFamily: '"Georgia", "Times New Roman", serif',
  },
});

function NavBar() {
  const location = useLocation();
  const [attentionCount, setAttentionCount] = useState(0);
  
  useEffect(() => {
    const loadAttentionCount = async () => {
      try {
        const data = await fetchAttentionItems();
        setAttentionCount(data.count || 0);
      } catch (err) {
        console.error('Failed to fetch attention items:', err);
      }
    };
    
    loadAttentionCount();
    // Refresh attention count every 30 seconds
    const interval = setInterval(loadAttentionCount, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const isActive = (path) => {
    if (path === '/books') {
      return location.pathname === '/' || location.pathname.startsWith('/books');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            backgroundImage: 'url(/bookshelf-bg.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            display: 'inline-block',
          }}
        >
          WeeWordsWorkshop
        </Typography>
        <Button 
          color="inherit" 
          component={Link} 
          to="/books"
          sx={{ 
            textDecoration: isActive('/books') ? 'underline' : 'none',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          Books
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/covers"
          sx={{ 
            textDecoration: isActive('/covers') ? 'underline' : 'none',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          Covers
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/formats"
          sx={{ 
            textDecoration: isActive('/formats') ? 'underline' : 'none',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          Formats
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/print_queue"
          sx={{ 
            textDecoration: isActive('/print_queue') ? 'underline' : 'none',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          Print Queue
        </Button>
        {attentionCount > 0 && (
          <IconButton 
            color="inherit" 
            component={Link} 
            to="/attention"
            title="Items need attention"
            sx={{ 
              ml: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <Badge badgeContent={attentionCount} color="error">
              <WarningIcon />
            </Badge>
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <NavBar />

          <Box component="main" sx={{ p: 3 }}>
            <Routes>
              <Route path="/" element={<BooksIndex />} />
              <Route path="/books/new" element={<BooksNew />} />
              <Route path="/books" element={<BooksIndex />} />
              <Route path="/books/:id" element={<BookShow />} />
              <Route path="/covers" element={<CoversIndex />} />
              <Route path="/covers/:id" element={<CoverShow />} />
              <Route path="/formats" element={<FormatsIndex />} />
              <Route path="/formats/:id" element={<FormatShow />} />
              <Route path="/print_queue" element={<PrintQueueIndex />} />
              <Route path="/attention" element={<AttentionIndex />} />
              <Route path="/job_orders" element={<JobOrdersIndex />} />
              <Route path="/job_orders/:id" element={<JobOrderShow />} />
              <Route path="/print_exports" element={<PrintExportsIndex />} />
              <Route path="/print_exports/:id" element={<PrintExportShow />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
