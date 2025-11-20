import React from 'react';
import { Link } from 'react-router-dom';

export default function CoverCard({ cover }) {
  const title = cover.title || cover.name || 'Untitled';
  const img =
    cover.thumb_url ||
    cover.image_url ||
    cover.thumbnail_url ||
    (cover.image_signed_id && cover.image_filename
      ? `http://localhost:3000/rails/active_storage/blobs/redirect/${cover.image_signed_id}/${encodeURIComponent(
          cover.image_filename
        )}`
      : null);

  return (
    <article style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <Link to={`/covers/${cover.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {img && (
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <img src={img} alt={title} style={{ maxWidth: 120, maxHeight: 120, borderRadius: 4, boxShadow: '0 1px 4px #ccc' }} />
          </div>
        )}
        <h3 style={{ margin: '8px 0' }}>{title}</h3>
        <div style={{ fontSize: 12, color: '#777' }}>ID: {cover.id}</div>
      </Link>
    </article>
  );
}
