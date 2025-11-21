import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import AddIcon from '@mui/icons-material/Add';
import { fetchCovers, createCover, deleteCover, fetchCover, updateCover, uploadCoverImage } from '../api/covers';
import { incrementJobOrder, decrementJobOrder } from '../api/printQueue';
import { createJobOrder } from '../api/job_orders';
import CoverList from '../components/CoverList';
import CoverForm from '../components/CoverForm';
import Modal from '../components/Modal';
import SearchControls from '../components/SearchControls';

export default function CoversIndex() {
  const [covers, setCovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editingOpen, setEditingOpen] = useState(false);
  const [editingCover, setEditingCover] = useState(null);
  const [editingLoading, setEditingLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingCover, setDeletingCover] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [queueLoading, setQueueLoading] = useState(new Set());

  const load = (opts = {}) => {
    // debug: log when load is invoked
    // eslint-disable-next-line no-console
    console.debug('CoversIndex.load', opts);
    setLoading(true);
    setError(null);
    const p = opts.page || page;
    const s = opts.search !== undefined ? opts.search : search;
    fetchCovers({ page: p, search: s })
      .then((data) => {
        setCovers(Array.isArray(data.covers) ? data.covers : data);
        setPage(data.page || p);
        setPerPage(data.per_page || perPage);
        setTotalCount(data.total_count || 0);
      })
      .catch((e) => setError(e.message || String(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load({ page: 1 }); }, []);

  // Search is handled by SearchControls (debounced internally)

  const gotoPage = (e, p) => {
    if (p === page) return;
    setPage(p);
    load({ page: p });
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

  const handleCreate = async (payload) => {
    try {
      await createCover(payload);
      setCreating(false);
      load();
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  const openDeleteModal = (cover) => {
    setDeletingCover(cover);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingCover) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteCover(deletingCover.id);
      setDeleteOpen(false);
      setDeletingCover(null);
      load();
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

  const openEditor = async (cover) => {
    setEditingLoading(true);
    setError(null);
    try {
      // fetch fresh cover data before editing
      const data = await fetchCover(cover.id);
      setEditingCover(data);
      setEditingOpen(true);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setEditingLoading(false);
    }
  };

  const handleUpdate = async (payload, file) => {
    if (!editingCover) return;
    try {
      await updateCover(editingCover.id, payload);
      if (file) {
        await uploadCoverImage(editingCover.id, file);
      }
      setEditingOpen(false);
      setEditingCover(null);
      load();
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  // Keep search controls mounted during loading to avoid remount loops.

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
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

      <SearchControls onSearch={(s) => { setSearch(s); setPage(1); load({ page: 1, search: s }); }} placeholder="Search covers..." />
      
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
      <Modal open={creating} onClose={() => setCreating(false)} title="New Cover" width={600}>
        <CoverForm onCancel={() => setCreating(false)} onSubmit={async (payload, file) => {
          try {
            const created = await (await import('../api/covers')).createCover(payload);
            if (file) {
              await uploadCoverImage(created.id, file);
            }
            setCovers((cs) => [created, ...cs]);
            setTotalCount((c) => c + 1);
            setCreating(false);
            load();
          } catch (e) {
            setError(e.message || String(e));
          }
        }} />
      </Modal>
      <CoverList covers={covers} onEdit={openEditor} onDelete={openDeleteModal} onImageUpload={async (coverId, file) => {
        setError(null);
        try {
          await uploadCoverImage(coverId, file);
          load();
        } catch (e) {
          setError(e.message || String(e));
        }
      }} onQuantityChange={async (jobOrderId, action, coverId) => {
        if (!jobOrderId || queueLoading.has(coverId)) return;
        setQueueLoading(prev => new Set(prev).add(coverId));
        setError(null);
        try {
          // optimistic update locally
          setCovers((cs) => cs.map((c) => (c.job_order_id === jobOrderId ? { ...c, print_quantity: Math.max(0, (c.print_quantity || 0) + (action === 'increment' ? 1 : -1)) } : c)));
          const res = action === 'increment' ? await incrementJobOrder(jobOrderId) : await decrementJobOrder(jobOrderId);
          // handle server response; if deleted, clear job_order_id/print_quantity
          if (res.deleted) {
            setCovers((cs) => cs.map((c) => (c.job_order_id === res.id ? { ...c, job_order_id: null, print_quantity: 0 } : c)));
          } else {
            setCovers((cs) => cs.map((c) => (c.job_order_id === res.id ? { ...c, print_quantity: res.quantity } : c)));
          }
        } catch (e) {
          setError(e.message || String(e));
          // reload to recover correct state
          load();
        } finally {
          setQueueLoading(prev => {
            const next = new Set(prev);
            next.delete(coverId);
            return next;
          });
        }
      }} onAddToQueue={async (coverId) => {
        if (queueLoading.has(coverId)) return;
        setQueueLoading(prev => new Set(prev).add(coverId));
        setError(null);
        // optimistic: set print_quantity to 1 for the cover
        setCovers((cs) => cs.map((c) => (c.id === coverId ? { ...c, print_quantity: 1 } : c)));
        try {
          const created = await createJobOrder({ cover_id: coverId, quantity: 1 });
          // created should be the job order; find the cover and attach job_order_id and quantity
          setCovers((cs) => cs.map((c) => (c.id === coverId ? { ...c, job_order_id: created.id, print_quantity: created.quantity } : c)));
        } catch (e) {
          setError(e.message || String(e));
          load();
        } finally {
          setQueueLoading(prev => {
            const next = new Set(prev);
            next.delete(coverId);
            return next;
          });
        }
      }} queueLoading={queueLoading} />
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
      <Modal open={editingOpen} onClose={() => { setEditingOpen(false); setEditingCover(null); }} title={editingLoading ? 'Loading…' : 'Edit Cover'} width={600}>
        {editingCover ? (
          <CoverForm initial={editingCover} onCancel={() => { setEditingOpen(false); setEditingCover(null); }} onSubmit={handleUpdate} />
        ) : (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography>{editingLoading ? 'Loading cover…' : 'No cover selected.'}</Typography>
          </Box>
        )}
      </Modal>
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
