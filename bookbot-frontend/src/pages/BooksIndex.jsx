import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import BookForm from '../components/BookForm';
import Modal from '../components/Modal';
import { fetchBooks, deleteBook } from '../api/books';
import BookList from '../components/BookList';
import SearchControls from '../components/SearchControls';
import { API_BASE_URL } from '../config';

export default function BooksIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [perPage, setPerPage] = useState(15);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedRef = useRef(null);

  const load = (opts = {}) => {
    setLoading(true);
    setError(null);
    const p = opts.page !== undefined ? opts.page : page;
    const s = opts.search !== undefined ? opts.search : search;
    
    // Update URL params
    const params = {};
    if (p > 1) params.page = p.toString();
    if (s) params.search = s;
    setSearchParams(params, { replace: true });
    
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

  useEffect(() => { 
    // Load with params from URL on mount
    load({ page, search }); 
  }, []);

  const gotoPage = (e, p) => {
    if (p === page) return;
    setPage(p);
    load({ page: p, search });
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

  const handleExport = () => {
    window.location.href = `${API_BASE_URL}/api/books/export.xlsx`;
  };

  const openDeleteDialog = (book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookToDelete) return;
    setDeleting(true);
    try {
      await deleteBook(bookToDelete.id);
      setBooks(books.filter(b => b.id !== bookToDelete.id));
      setTotalCount(c => c - 1);
      setDeleteDialogOpen(false);
      setBookToDelete(null);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Books
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export to Excel
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setCreating(true)}
          >
            Add New Book
          </Button>
        </Box>
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

      <SearchControls 
        onSearch={(s) => { 
          setSearch(s);
          setPage(1); 
          load({ page: 1, search: s }); 
        }} 
        placeholder="Search books..." 
        initial={search}
      />
      
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

      <BookList books={books} onDelete={openDeleteDialog} />

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

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        TransitionProps={{ timeout: 0 }}
      >
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{bookToDelete?.title}</strong>?
            {bookToDelete?.author && <> by <strong>{bookToDelete.author}</strong></>}?
            <Box sx={{ mt: 1 }}>
              This will also delete all covers associated with this book. This action cannot be undone.
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
