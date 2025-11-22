import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { fetchBook, updateBook, deleteBook } from '../api/book';
import { fetchCoversForBook, fetchCover, updateCover, deleteCover, createCover, uploadCoverImage } from '../api/covers';
import { incrementJobOrder, decrementJobOrder } from '../api/printQueue';
import { createJobOrder } from '../api/job_orders';
import CoverList from '../components/CoverList';
import BookForm from '../components/BookForm';
import CoverForm from '../components/CoverForm';
import Modal from '../components/Modal';

export default function BookShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
    const [covers, setCovers] = useState([]);
    const [coversLoading, setCoversLoading] = useState(true);
    const [editingOpen, setEditingOpen] = useState(false);
    const [editingCover, setEditingCover] = useState(null);
    const [editingLoading, setEditingLoading] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingCover, setDeletingCover] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [creating, setCreating] = useState(false);
    const [deleteBookOpen, setDeleteBookOpen] = useState(false);
    const [deletingBook, setDeletingBook] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchBook(id)
      .then((data) => {
        if (!mounted) return;
        setBook(data);
      })
      .catch((err) => setError(err.message || String(err)))
      .finally(() => mounted && setLoading(false));
      setCoversLoading(true);
      fetchCoversForBook(id)
        .then((data) => {
          if (!mounted) return;
          setCovers(Array.isArray(data.covers) ? data.covers : data);
        })
        .catch(() => setCovers([]))
        .finally(() => mounted && setCoversLoading(false));
    return () => { mounted = false; };
  }, [id]);

  const handleUpdate = async (payload) => {
    setError(null);
    try {
      const updated = await updateBook(id, payload);
      setBook(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message || String(err));
    }
  };

  const handleDeleteBook = async () => {
    setDeletingBook(true);
    setError(null);
    try {
      await deleteBook(id);
      navigate('/books');
    } catch (err) {
      setError(err.message || String(err));
      setDeletingBook(false);
    }
  };

  const openEditor = async (cover) => {
    setEditingLoading(true);
    setError(null);
    try {
      const data = await fetchCover(cover.id);
      setEditingCover(data);
      setEditingOpen(true);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setEditingLoading(false);
    }
  };

  const openDeleteModal = (cover) => {
    setDeletingCover(cover);
    setDeleteOpen(true);
    setError(null);
  };

  const confirmDelete = async () => {
    if (!deletingCover) return;
    setDeleting(true);
    try {
      await deleteCover(deletingCover.id);
      setCovers((cs) => cs.filter((c) => c.id !== deletingCover.id));
      setDeleteOpen(false);
      setDeletingCover(null);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteOpen(false);
    setDeletingCover(null);
  };

  const handleUpdateCover = async (payload, file) => {
    if (!editingCover) return;
    try {
      const updated = await updateCover(editingCover.id, payload);
      if (file) {
        await uploadCoverImage(editingCover.id, file);
      }
      setCovers((cs) => cs.map((c) => (c.id === updated.id ? updated : c)));
      setEditingOpen(false);
      setEditingCover(null);
      // Reload covers to get updated image
      fetchCoversForBook(id).then((data) => setCovers(Array.isArray(data.covers) ? data.covers : data)).catch(() => {});
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  const handleCreateCover = async (payload, file) => {
    try {
      const created = await createCover({ ...payload, book_id: id });
      if (file) {
        await uploadCoverImage(created.id, file);
      }
      setCreating(false);
      // Reload covers to get the new cover with image
      fetchCoversForBook(id).then((data) => setCovers(Array.isArray(data.covers) ? data.covers : data)).catch(() => {});
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography>Loading book…</Typography>
      </Box>
    </Container>
  );
  
  if (!book) return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography>Book not found.</Typography>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>Error: {error}</Alert>}
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
          {book.title || 'Untitled'}
        </Typography>
        {!editing && (
          <>
            <IconButton onClick={() => setEditing(true)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => setDeleteBookOpen(true)} color="error">
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </Box>

      {!editing ? (
        <Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Author</Typography>
                <Typography variant="body1">{book.author || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Page count</Typography>
                <Typography variant="body1">{book.page_count || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Series</Typography>
                <Typography variant="body1">{book.series || '—'}</Typography>
              </Box>
              {book.note && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Note</Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{book.note}</Typography>
                </Box>
              )}
            </Box>
          </Paper>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">
                Covers
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setCreating(true)}
              >
                New Cover
              </Button>
            </Box>
            {coversLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography>Loading covers…</Typography>
              </Box>
            ) : (
              <CoverList covers={covers} onEdit={openEditor} onDelete={openDeleteModal} onImageUpload={async (coverId, file) => {
                setError(null);
                try {
                  await uploadCoverImage(coverId, file);
                  fetchCoversForBook(id).then((data) => setCovers(Array.isArray(data.covers) ? data.covers : data)).catch(() => {});
                } catch (e) {
                  setError(e.message || String(e));
                }
              }} onQuantityChange={async (jobOrderId, action, coverId) => {
                if (!jobOrderId) return;
                setError(null);
                try {
                  setCovers((cs) => cs.map((c) => (c.job_order_id === jobOrderId ? { ...c, print_quantity: Math.max(0, (c.print_quantity || 0) + (action === 'increment' ? 1 : -1)) } : c)));
                  const res = action === 'increment' ? await incrementJobOrder(jobOrderId) : await decrementJobOrder(jobOrderId);
                  if (res.deleted) {
                    setCovers((cs) => cs.map((c) => (c.job_order_id === res.id ? { ...c, job_order_id: null, print_quantity: 0 } : c)));
                  } else {
                    setCovers((cs) => cs.map((c) => (c.job_order_id === res.id ? { ...c, print_quantity: res.quantity } : c)));
                  }
                } catch (e) {
                  setError(e.message || String(e));
                  fetchCoversForBook(id).then((data) => setCovers(Array.isArray(data.covers) ? data.covers : data)).catch(() => {});
                }
              }} onAddToQueue={async (coverId) => {
                setError(null);
                setCovers((cs) => cs.map((c) => (c.id === coverId ? { ...c, print_quantity: 1 } : c)));
                try {
                  const created = await createJobOrder({ cover_id: coverId, quantity: 1 });
                  setCovers((cs) => cs.map((c) => (c.id === coverId ? { ...c, job_order_id: created.id, print_quantity: created.quantity } : c)));
                } catch (e) {
                  setError(e.message || String(e));
                  fetchCoversForBook(id).then((data) => setCovers(Array.isArray(data.covers) ? data.covers : data)).catch(() => {});
                }
              }} />
            )}
            
            <Modal open={creating} onClose={() => setCreating(false)} title="New Cover" width={600}>
              <CoverForm initial={{ book_id: id }} disableBookSelect={true} onCancel={() => setCreating(false)} onSubmit={handleCreateCover} />
            </Modal>
            
            <Modal open={editingOpen} onClose={() => { setEditingOpen(false); setEditingCover(null); }} title={editingLoading ? 'Loading…' : 'Edit Cover'} width={600}>
              {editingCover ? (
                <CoverForm initial={editingCover} disableBookSelect={true} onCancel={() => { setEditingOpen(false); setEditingCover(null); }} onSubmit={handleUpdateCover} />
              ) : (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <Typography>{editingLoading ? 'Loading cover…' : 'No cover selected.'}</Typography>
                </Box>
              )}
            </Modal>
            
            <Modal open={deleteOpen} onClose={cancelDelete} title="Confirm delete" width={520}>
              {deletingCover ? (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    Are you sure you want to delete the cover for{' '}
                    <strong>"{deletingCover.book_title || deletingCover.book || 'Unknown book'}"</strong>
                    {deletingCover.edition && (
                      <span> — Edition: <strong>{deletingCover.edition}</strong></span>
                    )}
                    ?
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button variant="contained" color="error" onClick={confirmDelete} disabled={deleting}>
                      {deleting ? 'Deleting…' : 'Delete'}
                    </Button>
                    <Button variant="outlined" onClick={cancelDelete}>Cancel</Button>
                  </Box>
                </Box>
              ) : (
                <Typography>Nothing selected.</Typography>
              )}
            </Modal>
          </Box>
        </Box>
      ) : (
        <BookForm initial={book} onCancel={() => setEditing(false)} onSubmit={handleUpdate} />
      )}

      <Dialog
        open={deleteBookOpen}
        onClose={() => setDeleteBookOpen(false)}
        TransitionProps={{ timeout: 0 }}
      >
        <DialogTitle>Delete Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{book?.title}</strong>?
            {book?.author && <> by <strong>{book.author}</strong></>}?
            <Box sx={{ mt: 1 }}>
              This will also delete all {covers.length} cover{covers.length !== 1 ? 's' : ''} associated with this book. This action cannot be undone.
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteBookOpen(false)} disabled={deletingBook}>
            Cancel
          </Button>
          <Button onClick={handleDeleteBook} color="error" variant="contained" disabled={deletingBook}>
            {deletingBook ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
