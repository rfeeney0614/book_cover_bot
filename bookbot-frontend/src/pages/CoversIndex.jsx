import React, { useEffect, useState } from 'react';
import { fetchCovers, createCover, deleteCover } from '../api/covers';
import CoverList from '../components/CoverList';
import CoverForm from '../components/CoverForm';
import Modal from '../components/Modal';
import SearchControls from '../components/SearchControls';

export default function CoversIndex() {
  const [covers, setCovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
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

  const handleDelete = async (id) => {
    if (!confirm('Delete this cover?')) return;
    try {
      await deleteCover(id);
      load();
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
      <CoverList covers={covers} />
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
