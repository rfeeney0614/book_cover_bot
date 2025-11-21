import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBook, updateBook } from '../api/book';
import { fetchCoversForBook, fetchCover, updateCover, deleteCover } from '../api/covers';
import { incrementJobOrder, decrementJobOrder } from '../api/printQueue';
import { createJobOrder } from '../api/job_orders';
import CoverList from '../components/CoverList';
import BookForm from '../components/BookForm';
import CoverForm from '../components/CoverForm';
import Modal from '../components/Modal';
import Button from '../components/Button';

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

  const handleUpdateCover = async (payload) => {
    if (!editingCover) return;
    try {
      const updated = await updateCover(editingCover.id, payload);
      setCovers((cs) => cs.map((c) => (c.id === updated.id ? updated : c)));
      setEditingOpen(false);
      setEditingCover(null);
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading book…</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;
  if (!book) return <div style={{ padding: 20 }}>Book not found.</div>;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)}>Back</button>
      <h2>{book.title || 'Untitled'}</h2>
      {!editing ? (
        <div>
          <div><strong>Author:</strong> {book.author}</div>
          <div><strong>Page count:</strong> {book.page_count}</div>
          <div><strong>Series:</strong> {book.series}</div>
          <div style={{ marginTop: 12 }}><strong>Note:</strong>
            <div style={{ whiteSpace: 'pre-wrap' }}>{book.note}</div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => setEditing(true)}>Edit</button>
          </div>
            <div style={{ marginTop: 24 }}>
              <h3>Associated Covers</h3>
                {coversLoading ? <div>Loading covers…</div> : <CoverList covers={covers} onEdit={openEditor} onDelete={openDeleteModal} onQuantityChange={async (jobOrderId, action) => {
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
                    // re-fetch covers on error
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
                }} />}
                <Modal open={editingOpen} onClose={() => { setEditingOpen(false); setEditingCover(null); }} title={editingLoading ? 'Loading…' : 'Edit Cover'} width={600}>
                  {editingCover ? (
                    <CoverForm initial={editingCover} disableBookSelect={true} onCancel={() => { setEditingOpen(false); setEditingCover(null); }} onSubmit={handleUpdateCover} />
                  ) : (
                    <div style={{ padding: 20 }}>{editingLoading ? 'Loading cover…' : 'No cover selected.'}</div>
                  )}
                </Modal>
                <Modal open={deleteOpen} onClose={cancelDelete} title="Confirm delete" width={520}>
                  <div style={{ padding: 12 }}>
                    {deletingCover ? (
                      <>
                        <p>
                          Are you sure you want to delete the cover for 
                          <strong> "{deletingCover.book_title || deletingCover.book || 'Unknown book'}"</strong>
                          {deletingCover.edition ? (
                            <span> — Edition: <strong>{deletingCover.edition}</strong></span>
                          ) : null}
                          ?
                        </p>
                        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                          <Button variant="destructive" size="md" onClick={confirmDelete} disabled={deleting}>
                            {deleting ? 'Deleting…' : 'Delete'}
                          </Button>
                          <Button variant="secondary" size="md" onClick={cancelDelete}>Cancel</Button>
                        </div>
                      </>
                    ) : (
                      <div>Nothing selected.</div>
                    )}
                  </div>
                </Modal>
            </div>
        </div>
      ) : (
        <BookForm initial={book} onCancel={() => setEditing(false)} onSubmit={handleUpdate} />
      )}
    </div>
  );
}
