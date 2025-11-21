import React from 'react';
import { Link } from 'react-router-dom';
import CoverImage from './CoverImage';

export default function BookCard({ book }) {
  const title = book.title || book.name || 'Untitled';
  const author = book.author || book.authors || '';

  // Prefer the first cover attached to the book, fall back to legacy urls
  let img = null;
  if (book.covers && Array.isArray(book.covers) && book.covers.length > 0) {
    const first = book.covers[0];
    img = first.thumb_url || first.image_url || first.thumbnail_url || (first.image_signed_id && first.image_filename ? `http://localhost:3000/rails/active_storage/blobs/redirect/${first.image_signed_id}/${encodeURIComponent(first.image_filename)}` : null);
  }
  // server may provide a single representative `cover` object on books index
  if (!img && book.cover) {
    const c = book.cover;
    img = c.image_url || (c.image_signed_id && c.image_filename ? `http://localhost:3000/rails/active_storage/blobs/redirect/${c.image_signed_id}/${encodeURIComponent(c.image_filename)}` : null);
  }
  img = img || book.cover_url || book.image_url || book.thumbnail_url || null;

  return (
    <article style={{ border: '1px solid #ddd', borderRadius: 6, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Link to={`/books/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CoverImage src={img} alt={title} />

        <div style={{ padding: 12 }}>
          <h3 style={{ margin: '8px 0' }}>{title}</h3>
          {author && <div style={{ color: '#555', marginBottom: 8 }}>{author}</div>}
          
        </div>
      </Link>
    </article>
  );
}
