import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                BookBot
              </Typography>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/books">Books</Button>
              <Button color="inherit" component={Link} to="/covers">Covers</Button>
              <Button color="inherit" component={Link} to="/formats">Formats</Button>
              <Button color="inherit" component={Link} to="/print_queue">Print Queue</Button>
            </Toolbar>
          </AppBar>

          <Box component="main" sx={{ p: 3 }}>
            <Routes>
              <Route path="/" element={<Home />} />
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

function Home() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to BookBot
      </Typography>
      <Typography variant="body1">
        Use the Books page to browse available books.
      </Typography>
    </Box>
  );
}

export default App;
