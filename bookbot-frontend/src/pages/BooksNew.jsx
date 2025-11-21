import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookForm from '../components/BookForm';
import { createBook } from '../api/books';

export default function BooksNew() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (book) => {
    setLoading(true);
    setError(null);
    try {
      await createBook(book);
      navigate('/books');
    } catch (err) {
      setError(err.message || 'Failed to create book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <h2>New Book</h2>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <BookForm onSubmit={handleSubmit} onCancel={() => navigate('/books')} />
      {loading && <div>Saving...</div>}
    </div>
  );
}
