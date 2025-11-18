import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BooksIndex from './pages/BooksIndex';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="App-nav">
          <Link to="/">Home</Link>
          {' | '}
          <Link to="/books">Books</Link>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<BooksIndex />} />
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
