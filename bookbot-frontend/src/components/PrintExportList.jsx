import React from 'react';
import PrintExportCard from './PrintExportCard';

export default function PrintExportList({ exportsList = [], onDelete }) {
  if (!exportsList.length) return <div>No exports.</div>;
  return (
    <div>
      {exportsList.map((e) => (
        <PrintExportCard key={e.id} exp={e} onDelete={onDelete} />
      ))}
    </div>
  );
}
