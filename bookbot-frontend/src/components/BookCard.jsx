import React from 'react';
import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  const title = book.title || book.name || 'Untitled';
  const author = book.author || book.authors || '';
  const img = book.cover_url || book.image_url || book.thumbnail_url || null;

  return (
    <article style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <Link to={`/books/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {img && (
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <img src={img} alt={title} style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}
        <h3 style={{ margin: '8px 0' }}>{title}</h3>
        {author && <div style={{ color: '#555', marginBottom: 8 }}>{author}</div>}
        <div style={{ fontSize: 12, color: '#777' }}>ID: {book.id}</div>
      </Link>
    </article>
  );
}
