import React from 'react';
import { Link } from 'react-router-dom';

export default function FormatCard({ format, onDelete, onSetDefault }) {
  const handleDefaultChange = () => {
    if (!format.default && onSetDefault) {
      onSetDefault(format.id);
    }
  };
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>{format.name || `Format ${format.id}`}</strong>
          <div style={{ fontSize: 12, color: '#666' }}>{format.description}</div>
          <div style={{ fontSize: 13, color: '#444', marginTop: 4 }}>Height: {format.height ?? '—'}</div>
          <label style={{ fontSize: 13, color: '#444', marginTop: 4, display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={format.default === true || format.default === 1 || format.default === 'true'}
              onChange={handleDefaultChange}
              style={{ marginRight: 6 }}
            />
            Default
          </label>
        </div>
        <div>
          <Link to={`/formats/${format.id}`} style={{ marginRight: 8 }}>Edit</Link>
          <button onClick={() => onDelete && onDelete(format.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
