import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import { fetchFormats, createFormat, deleteFormat, updateFormat } from '../api/formats';
import FormatList from '../components/FormatList';
import FormatForm from '../components/FormatForm';
import Modal from '../components/Modal';

export default function FormatsIndex() {
  const [formats, setFormats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingFormat, setEditingFormat] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingFormat, setDeletingFormat] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    fetchFormats()
      .then((data) => setFormats(Array.isArray(data) ? data : data.formats || []))
      .catch((e) => setError(e.message || String(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (payload) => {
    try {
      await createFormat(payload);
      setCreating(false);
      load();
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  const openDeleteModal = (format) => {
    setDeletingFormat(format);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingFormat) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteFormat(deletingFormat.id);
      setDeleteOpen(false);
      setDeletingFormat(null);
      load();
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteOpen(false);
    setDeletingFormat(null);
  };

  const handleEdit = (format) => {
    setEditingFormat(format);
    setEditing(true);
  };

  const handleUpdate = async (payload) => {
    if (!editingFormat) return;
    try {
      await updateFormat(editingFormat.id, payload);
      setEditing(false);
      setEditingFormat(null);
      load();
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  const handleSetDefault = async (formatId) => {
    // Optimistically update local state so cards don't reorder on reload.
    const previous = formats;
    setFormats((fs) => fs.map((f) => ({ ...f, default: f.id === formatId })));
    try {
      const res = await fetch(`/api/formats/${formatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ default: true }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to set default (${res.status}): ${text}`);
      }
      // Optionally update the single format from the response to keep timestamps in sync
      try {
        const updated = await res.json().catch(() => null);
        if (updated && updated.id) {
          setFormats((fs) => fs.map((f) => (f.id === updated.id ? { ...f, ...updated } : f)));
        }
      } catch (_) {}
    } catch (e) {
      setError(e.message || String(e));
      // Revert on failure
      setFormats(previous);
    }
  };

  if (loading) return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography>Loading formats…</Typography>
      </Box>
    </Container>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Formats
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setCreating(true)}
        >
          New Format
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>Error: {error}</Alert>}

      <Modal open={creating} onClose={() => setCreating(false)} title="New Format" width={400}>
        <FormatForm onCancel={() => setCreating(false)} onSubmit={async (payload) => {
          try {
            const created = await (await import('../api/formats')).createFormat(payload);
            setFormats((fs) => [created, ...fs]);
            setCreating(false);
          } catch (e) {
            setError(e.message || String(e));
          }
        }} />
      </Modal>

      <Modal open={editing} onClose={() => { setEditing(false); setEditingFormat(null); }} title="Edit Format" width={400}>
        {editingFormat && (
          <FormatForm initial={editingFormat} onCancel={() => { setEditing(false); setEditingFormat(null); }} onSubmit={handleUpdate} />
        )}
      </Modal>

      <Modal open={deleteOpen} onClose={cancelDelete} title="Confirm delete" width={520}>
        {deletingFormat ? (
          <Box>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete the format{' '}
              <strong>"{deletingFormat.name || 'Unknown format'}"</strong>
              {deletingFormat.height && (
                <span> (Height: <strong>{deletingFormat.height}</strong>)</span>
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

      <FormatList formats={formats} onDelete={openDeleteModal} onSetDefault={handleSetDefault} onEdit={handleEdit} />
    </Container>
  );
}
