import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobOrder } from '../api/job_orders';

export default function JobOrderShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobOrder(id)
      .then((data) => setJob(data))
      .catch((e) => setError(e.message || String(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Loading job…</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;
  if (!job) return <div style={{ padding: 20 }}>Job not found</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Print Job #{job.id}</h2>
      <pre>{JSON.stringify(job, null, 2)}</pre>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => navigate('/print_queue')}>Back</button>
      </div>
    </div>
  );
}
