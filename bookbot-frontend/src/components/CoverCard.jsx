import React from 'react';
import { Link } from 'react-router-dom';
import CoverImage from './CoverImage';

export default function CoverCard(props) {
  const { cover, onOpen, onDelete } = props;
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

  const altText = img ? 'Cover' : 'Missing image';

  const content = (
    <>
      <CoverImage src={img} alt={altText} />
      <div style={{ padding: 12 }}>
        {/* No title for covers */}
        <div style={{ fontSize: 12, color: '#444' }}>{cover.book_title || cover.book || 'Unknown book'}</div>
        <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>{cover.edition ? `Edition: ${cover.edition}` : null}</div>
        <div style={{ fontSize: 12, color: '#777' }}>{cover.format_name ? `Format: ${cover.format_name}` : null}</div>
      </div>
    </>
  );

  // show print quantity and +/- if present
  const hasJobOrder = cover.job_order_id || cover.print_quantity;

  return (
    <article style={{ border: '1px solid #ddd', borderRadius: 6, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {onOpen ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => onOpen(cover)}
          onKeyPress={(e) => { if (e.key === 'Enter') onOpen(cover); }}
          style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
        >
          {content}
        </div>
      ) : (
        <Link to={`/covers/${cover.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {content}
        </Link>
      )}

      {/* Actions area at the bottom */}
      {hasJobOrder ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: 12 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ padding: '6px 10px', background: '#f3f4f6', borderRadius: 4, minWidth: 64, textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>{cover.print_quantity || 0}</div>
              <div style={{ fontSize: 11, color: '#555' }}>queued</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); props.onQuantityChange && props.onQuantityChange(cover.job_order_id, 'decrement'); }}
                style={{ padding: '6px 8px', borderRadius: 4, cursor: 'pointer' }}
                title="Decrease quantity"
              >−</button>
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); props.onQuantityChange && props.onQuantityChange(cover.job_order_id, 'increment'); }}
                style={{ padding: '6px 8px', borderRadius: 4, cursor: 'pointer' }}
                title="Increase quantity"
              >+</button>
            </div>
          </div>
          {onDelete && (
            <div>
              <button
                aria-label="Delete cover"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(cover); }}
                title="Delete cover"
                style={{
                  background: '#fee2e2',
                  border: '1px solid #f87171',
                  color: '#b91c1c',
                  cursor: 'pointer',
                  fontSize: 14,
                  padding: '6px 8px',
                  borderRadius: 6,
                  lineHeight: 1,
                }}
              >
                🗑
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12 }}>
          <div>
            <button
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); props.onAddToQueue && props.onAddToQueue(cover.id); }}
              style={{ padding: '6px 10px', borderRadius: 6, background: '#e6f4ea', border: '1px solid #a7f3d0', cursor: 'pointer' }}
              title="Add initial print job"
            >
              Add to queue
            </button>
          </div>
          {onDelete && (
            <div>
              <button
                aria-label="Delete cover"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(cover); }}
                title="Delete cover"
                style={{
                  background: '#fee2e2',
                  border: '1px solid #f87171',
                  color: '#b91c1c',
                  cursor: 'pointer',
                  fontSize: 14,
                  padding: '6px 8px',
                  borderRadius: 6,
                  lineHeight: 1,
                }}
              >
                🗑
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
