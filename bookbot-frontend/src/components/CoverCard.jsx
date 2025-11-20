import React from 'react';
import { Link } from 'react-router-dom';
import CoverImage from './CoverImage';

export default function CoverCard({ cover }) {
  // Covers do not have a title
  const img =
    cover.thumb_url ||
    cover.image_url ||
    cover.thumbnail_url ||
    (cover.image_signed_id && cover.image_filename
      ? `http://localhost:3000/rails/active_storage/blobs/redirect/${cover.image_signed_id}/${encodeURIComponent(
          cover.image_filename
        )}`
      : null);

  const altText = img ? "Cover" : "Missing image";

  return (
    <article style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <Link to={`/covers/${cover.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CoverImage src={img} alt="Cover" />

        {/* No title for covers */}
        <div style={{ fontSize: 12, color: '#444' }}>{cover.book_title || cover.book || 'Unknown book'}</div>
        <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>{cover.edition ? `Edition: ${cover.edition}` : null}</div>
        <div style={{ fontSize: 12, color: '#777' }}>{cover.format_name ? `Format: ${cover.format_name}` : null}</div>
        {/* Do not show ID */}
      </Link>
    </article>
  );
}
