import React from 'react';
import { Link } from 'react-router-dom';
import { printExportStatus, printExportDownload } from '../api/print_exports';

export default function PrintExportCard({ exp, onDelete }) {
  const handleStatus = async () => {
    try {
      const data = await printExportStatus(exp.id);
      alert(`Export ${data.id} status: ${data.status}`);
    } catch (e) {
      alert(`Failed to fetch status: ${e.message}`);
    }
  };

  const handleDownload = () => {
    try {
      printExportDownload(exp.id);
    } catch (e) {
      alert(`Download failed: ${e.message}`);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <strong>Export #{exp.id}</strong>
          <div style={{ fontSize: 12, color: '#666' }}>{exp.status}</div>
        </div>
        <div>
          <Link to={`/print_exports/${exp.id}`} style={{ marginRight: 8 }}>View</Link>
          <button onClick={handleStatus} style={{ marginRight: 8 }}>Status</button>
          <button onClick={handleDownload} style={{ marginRight: 8 }}>Download</button>
          <button onClick={() => onDelete && onDelete(exp.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
