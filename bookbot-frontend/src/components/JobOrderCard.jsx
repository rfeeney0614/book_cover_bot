import React from 'react';
import { Link } from 'react-router-dom';

export default function JobOrderCard({ job, onDelete }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <strong>Job #{job.id}</strong>
          <div style={{ fontSize: 12, color: '#666' }}>{job.summary || job.note}</div>
        </div>
        <div>
          <Link to={`/print_queue/${job.id}`} style={{ marginRight: 8 }}>View</Link>
          <button onClick={() => onDelete && onDelete(job.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}
