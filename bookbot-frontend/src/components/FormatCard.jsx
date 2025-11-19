import React from 'react';
import { Link } from 'react-router-dom';

export default function FormatCard({ format, onDelete }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <strong>{format.name || `Format ${format.id}`}</strong>
          <div style={{ fontSize: 12, color: '#666' }}>{format.description}</div>
        </div>
        <div>
          <Link to={`/formats/${format.id}`} style={{ marginRight: 8 }}>Edit</Link>
          <button onClick={() => onDelete && onDelete(format.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
