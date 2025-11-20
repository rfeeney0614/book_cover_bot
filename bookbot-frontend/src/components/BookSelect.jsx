import React, { useState, useEffect } from 'react';
import { fetchBooks } from '../api/books';

export default function BookSelect({ value, onChange, placeholder = 'Select book...' }) {
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchBooks({ search })
      .then((data) => {
        if (!active) return;
        const books = Array.isArray(data.books) ? data.books : data;
        setOptions(books);
      })
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
    return () => { active = false; };
  }, [search]);

  return (
    <div style={{ position: 'relative', minWidth: 220 }}>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', marginBottom: 4 }}
      />
      <select
        value={value || ''}
        onChange={e => onChange && onChange(e.target.value)}
        style={{ width: '100%' }}
      >
        <option value="">-- Select Book --</option>
        {options.map(b => (
          <option key={b.id} value={b.id}>{b.title} {b.author ? `by ${b.author}` : ''}</option>
        ))}
      </select>
      {loading && <div style={{ position: 'absolute', right: 8, top: 8, fontSize: 12 }}>Loading…</div>}
    </div>
  );
}
