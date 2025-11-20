import React, { useEffect, useState, useRef } from 'react';
import { fetchBooks } from '../api/books';
import BookList from '../components/BookList';

function Spinner({ size = 20 }) {
  const style = {
    width: size,
    height: size,
    border: `${Math.max(2, Math.round(size / 8))}px solid #ddd`,
    borderTop: `${Math.max(2, Math.round(size / 8))}px solid #333`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    display: 'inline-block',
    verticalAlign: 'middle',
  };
  return (
    <div style={{ display: 'inline-block', lineHeight: 0 }}>
      <div style={style} />
      <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
    </div>
  );
}

export default function BooksIndex() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  return (
    <div style={{ padding: 20 }}>
      <h2>Books</h2>

      <div style={{ marginBottom: 12 }}>
        <a href="/books/new">
          <button type="button">Add New Book</button>
        </a>
      </div>

      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: 8 }}
          disabled={loading}
        />
        <button onClick={() => { setPage(1); load({ page: 1, search: searchTerm }); }} disabled={loading}>
          Search
        </button>
        <span style={{ marginLeft: 12 }}>
          {loading ? <><Spinner size={14} /> <span style={{ marginLeft: 6 }}>Loading…</span></> : <span>{totalCount} results</span>}
        </span>
      </div>

      {error && <div style={{ padding: 12, color: 'red' }}>Error: {error}</div>}

      <BookList books={books} />

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
