import React, { useEffect, useState, useRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import AddIcon from '@mui/icons-material/Add';
import BookForm from '../components/BookForm';
import Modal from '../components/Modal';
import { fetchBooks } from '../api/books';
import BookList from '../components/BookList';
import SearchControls from '../components/SearchControls';

export default function BooksIndex() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const debouncedRef = useRef(null);

  const load = (opts = {}) => {
    setLoading(true);
    setError(null);
    const p = opts.page || page;
    const s = opts.search !== undefined ? opts.search : undefined;
    fetchBooks({ page: p, search: s })
      .then((data) => {
        setBooks(Array.isArray(data.books) ? data.books : data);
        setPage(data.page || p);
        setPerPage(data.per_page || perPage);
        setTotalCount(data.total_count || 0);
      })
      .catch((err) => setError(err.message || String(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load({ page: 1 }); }, []);

  const gotoPage = (e, p) => {
    if (p === page) return;
    setPage(p);
    load({ page: p });
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Books
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setCreating(true)}
        >
          Add New Book
        </Button>
      </Box>

      <Modal open={creating} onClose={() => setCreating(false)} title="New Book" width={800}>
        <BookForm onCancel={() => setCreating(false)} onSubmit={async (payload) => {
          try {
            const created = await (await import('../api/books')).createBook(payload);
            setBooks((b) => [created, ...b]);
            setTotalCount((c) => c + 1);
            setCreating(false);
          } catch (e) {
            setError(e.message || String(e));
          }
        }} />
      </Modal>

      <SearchControls onSearch={(s) => { setPage(1); load({ page: 1, search: s }); }} placeholder="Search books..." />
      
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        {loading ? (
          <>
            <CircularProgress size={16} />
            <Typography variant="body2" color="text.secondary">Loading…</Typography>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {totalCount} results
          </Typography>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>Error: {error}</Alert>}

      <BookList books={books} />

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={gotoPage}
            disabled={loading}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
}
