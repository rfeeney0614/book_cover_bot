import React, { useEffect, useState } from 'react';
import { fetchCovers, createCover, deleteCover, fetchCover, updateCover } from '../api/covers';
import { incrementJobOrder, decrementJobOrder } from '../api/printQueue';
import { createJobOrder } from '../api/job_orders';
import CoverList from '../components/CoverList';
import CoverForm from '../components/CoverForm';
import Modal from '../components/Modal';
import Button from '../components/Button';
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

  const load = (opts = {}) => {
    // debug: log when load is invoked
    // eslint-disable-next-line no-console
    console.debug('CoversIndex.load', opts);
    setLoading(true);
    setError(null);
    const p = opts.page || page;
    const s = opts.search !== undefined ? opts.search : undefined;
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

  const gotoPage = (p) => {
    if (p === page) return;
    setPage(p);
    load({ page: p });
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

  const pageNumbers = () => {
    const maxPages = 7;
    const start = Math.max(1, page - Math.floor(maxPages / 2));
    const end = Math.min(totalPages, start + maxPages - 1);
    const nums = [];
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  };

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

  const handleUpdate = async (payload) => {
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

  // Keep search controls mounted during loading to avoid remount loops.

  return (
    <div style={{ padding: 20 }}>
      <h2>Covers</h2>
      <div style={{ marginBottom: 12 }}>
        <button type="button" onClick={() => setCreating(true)}>New Cover</button>
      </div>
      <SearchControls onSearch={(s) => { setPage(1); load({ page: 1, search: s }); }} placeholder="Search covers..." />
      <div style={{ marginBottom: 12 }}>
        <span style={{ marginLeft: 12 }}>
          {loading ? <div>Loading…</div> : <div>{totalCount} results</div>}
        </span>
      </div>
      <Modal open={creating} onClose={() => setCreating(false)} title="New Cover" width={600}>
        <CoverForm onCancel={() => setCreating(false)} onSubmit={async (payload) => {
          try {
            const created = await (await import('../api/covers')).createCover(payload);
            setCovers((cs) => [created, ...cs]);
            setTotalCount((c) => c + 1);
            setCreating(false);
          } catch (e) {
            setError(e.message || String(e));
          }
        }} />
      </Modal>
      <CoverList covers={covers} onEdit={openEditor} onDelete={openDeleteModal} onQuantityChange={async (jobOrderId, action) => {
        if (!jobOrderId) return;
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
        }
      }} onAddToQueue={async (coverId) => {
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
        }
      }} />
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
      <Modal open={editingOpen} onClose={() => { setEditingOpen(false); setEditingCover(null); }} title={editingLoading ? 'Loading…' : 'Edit Cover'} width={600}>
        {editingCover ? (
          <CoverForm initial={editingCover} onCancel={() => { setEditingOpen(false); setEditingCover(null); }} onSubmit={handleUpdate} />
        ) : (
          <div style={{ padding: 20 }}>{editingLoading ? 'Loading cover…' : 'No cover selected.'}</div>
        )}
      </Modal>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => gotoPage(1)} disabled={loading || page <= 1}>First</button>
        <button onClick={() => gotoPage(Math.max(1, page - 1))} disabled={loading || page <= 1}>Prev</button>

        <div>
          {pageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => gotoPage(p)}
              disabled={loading}
              style={{ margin: '0 3px', fontWeight: p === page ? 'bold' : 'normal' }}
            >
              {p}
            </button>
          ))}
        </div>

        <button onClick={() => gotoPage(Math.min(totalPages, page + 1))} disabled={loading || page >= totalPages}>Next</button>
        <button onClick={() => gotoPage(totalPages)} disabled={loading || page >= totalPages}>Last</button>

        <div style={{ marginLeft: 'auto' }}>
          Page {page} of {totalPages}
        </div>
      </div>
    </div>
  );
}
