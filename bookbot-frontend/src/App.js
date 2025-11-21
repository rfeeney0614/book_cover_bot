import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
      paper: '#faf8f3',
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
  
  const isActive = (path) => {
    if (path === '/books') {
      return location.pathname === '/' || location.pathname.startsWith('/books');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          WeeWordsWorkshop
        </Typography>
        <Button 
          color="inherit" 
          component={Link} 
          to="/books"
          sx={{ textDecoration: isActive('/books') ? 'underline' : 'none' }}
        >
          Books
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/covers"
          sx={{ textDecoration: isActive('/covers') ? 'underline' : 'none' }}
        >
          Covers
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/formats"
          sx={{ textDecoration: isActive('/formats') ? 'underline' : 'none' }}
        >
          Formats
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/print_queue"
          sx={{ textDecoration: isActive('/print_queue') ? 'underline' : 'none' }}
        >
          Print Queue
        </Button>
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
