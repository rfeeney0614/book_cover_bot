import React, { useState, memo } from 'react';
import CoverImage from './CoverImage';

function PrintQueueItem({ item, onQuantityChange }) {
  const [localQuantity, setLocalQuantity] = useState(item.print_quantity);
  const img = item.thumb_url || item.image_url || null;

  const handleIncrement = async () => {
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    onQuantityChange(item.job_order_id, 'increment');
  };

  const handleDecrement = async () => {
    const newQuantity = localQuantity - 1;
    if (newQuantity > 0) {
      setLocalQuantity(newQuantity);
    }
    onQuantityChange(item.job_order_id, 'decrement');
  };

  return (
    <article style={{ 
      border: '1px solid #ddd', 
      padding: 16, 
      borderRadius: 6,
      display: 'flex',
      gap: 16,
      alignItems: 'center'
    }}>
      <CoverImage src={img} alt="Cover" style={{ maxWidth: 100, maxHeight: 100 }} />
      
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: 18 }}>{item.book_title}</h3>
        {item.book_author && (
          <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
            by {item.book_author}
          </div>
        )}
        {item.edition && (
          <div style={{ fontSize: 14, color: '#444', marginBottom: 4 }}>
            Edition: {item.edition}
          </div>
        )}
        {item.format_name && (
          <div style={{ fontSize: 14, color: '#444' }}>
            Format: {item.format_name}
          </div>
        )}
      </div>

      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8
      }}>
        <div style={{ 
          textAlign: 'center',
          padding: '8px 16px',
          backgroundColor: '#f0f0f0',
          borderRadius: 4,
          minWidth: 80
        }}>
          <div style={{ fontSize: 24, fontWeight: 'bold' }}>{localQuantity}</div>
          <div style={{ fontSize: 12, color: '#666' }}>to print</div>
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            onClick={handleDecrement}
            style={{ 
              padding: '6px 12px',
              fontSize: 18,
              cursor: 'pointer'
            }}
          >
            −
          </button>
          <button 
            onClick={handleIncrement}
            style={{ 
              padding: '6px 12px',
              fontSize: 18,
              cursor: 'pointer'
            }}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(PrintQueueItem);