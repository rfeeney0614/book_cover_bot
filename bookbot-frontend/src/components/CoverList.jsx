import React from 'react';
import CoverCard from './CoverCard';

export default function CoverList({ covers }) {
  if (!covers || covers.length === 0) return <div>No covers found.</div>;

  return (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
      {covers.map((c) => (
        <CoverCard key={c.id} cover={c} />
      ))}
    </div>
  );
}
