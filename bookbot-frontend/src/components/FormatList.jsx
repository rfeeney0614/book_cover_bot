import React from 'react';
import FormatCard from './FormatCard';

export default function FormatList({ formats = [], onDelete }) {
  if (!formats.length) return <div>No formats yet.</div>;
  return (
    <div>
      {formats.map((f) => (
        <FormatCard key={f.id} format={f} onDelete={onDelete} />
      ))}
    </div>
  );
}
