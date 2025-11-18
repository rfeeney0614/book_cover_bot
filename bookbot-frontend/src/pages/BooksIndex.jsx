import React, { useEffect, useState } from 'react';
import { fetchBooks } from '../api/books';
import BookList from '../components/BookList';

export default function BooksIndex() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchBooks()
      .then((data) => {
        if (!mounted) return;
        setBooks(data || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || String(err));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading books…</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Books</h2>
      <BookList books={books} />
    </div>
  );
}
