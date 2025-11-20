import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="App-nav">
          <Link to="/">Home</Link>
          {' | '}
          <Link to="/books">Books</Link>
          {' | '}
          <Link to="/covers">Covers</Link>
          {' | '}
          <Link to="/formats">Formats</Link>
          {' | '}
          <Link to="/print_queue">Print Queue</Link>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books/new" element={<BooksNew />} />
            <Route path="/books" element={<BooksIndex />} />
            <Route path="/books/:id" element={<BookShow />} />
            <Route path="/covers" element={<CoversIndex />} />
            <Route path="/covers/:id" element={<CoverShow />} />
            <Route path="/formats" element={<FormatsIndex />} />
            <Route path="/formats/:id" element={<FormatShow />} />
            <Route path="/print_queue" element={<JobOrdersIndex />} />
            <Route path="/print_queue/:id" element={<JobOrderShow />} />
            <Route path="/print_exports" element={<PrintExportsIndex />} />
            <Route path="/print_exports/:id" element={<PrintExportShow />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome to BookBot</h2>
      <p>Use the Books page to browse available books.</p>
    </div>
  );
}

export default App;
