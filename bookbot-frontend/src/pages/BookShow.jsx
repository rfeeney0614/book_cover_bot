import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBook, updateBook } from '../api/book';
import BookForm from '../components/BookForm';

export default function BookShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);

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
        </div>
      ) : (
        <BookForm initial={book} onCancel={() => setEditing(false)} onSubmit={handleUpdate} />
      )}
    </div>
  );
}
