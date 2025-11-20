import React, { useEffect, useState, useRef } from 'react';
import { fetchCovers, createCover, deleteCover } from '../api/covers';
import CoverList from '../components/CoverList';
import CoverForm from '../components/CoverForm';

export default function CoversIndex() {
  const [covers, setCovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [totalCount, setTotalCount] = useState(0);
  const debouncedRef = useRef(null);

  const load = (opts = {}) => {
    setLoading(true);
    setError(null);
    const p = opts.page || page;
    const s = opts.search !== undefined ? opts.search : searchTerm;
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

  // Debounce searchTerm and trigger load
  useEffect(() => {
    if (debouncedRef.current) clearTimeout(debouncedRef.current);
    debouncedRef.current = setTimeout(() => {
      setPage(1);
      load({ page: 1, search: searchTerm });
    }, 350);
    return () => clearTimeout(debouncedRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

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

  if (loading) return <div style={{ padding: 20 }}>Loading covers…</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Covers</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setCreating((c) => !c)}>{creating ? 'Cancel' : 'New Cover'}</button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Search covers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: 8 }}
          disabled={loading}
        />
        <button onClick={() => { setPage(1); load({ page: 1, search: searchTerm }); }} disabled={loading}>
          Search
        </button>
        <span style={{ marginLeft: 12 }}>
          {loading ? <span>Loading…</span> : <span>{totalCount} results</span>}
        </span>
      </div>
      {creating && <CoverForm onCancel={() => setCreating(false)} onSubmit={handleCreate} />}
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
