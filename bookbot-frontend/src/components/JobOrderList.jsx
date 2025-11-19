import React from 'react';
import JobOrderCard from './JobOrderCard';

export default function JobOrderList({ jobs = [], onDelete }) {
  if (!jobs.length) return <div>No print jobs.</div>;
  return (
    <div>
      {jobs.map((j) => (
        <JobOrderCard key={j.id} job={j} onDelete={onDelete} />
      ))}
    </div>
  );
}
