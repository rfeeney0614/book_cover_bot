import React from 'react';
import BookCard from './BookCard';

export default function BookList({ books }) {
  if (!books || books.length === 0) return <div>No books found.</div>;

  return (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
      {books.map((b) => (
        <BookCard key={b.id} book={b} />
      ))}
    </div>
  );
}
