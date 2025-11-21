import React, { useEffect, useState } from 'react';
import { fetchJobOrders, createJobOrder, deleteJobOrder } from '../api/job_orders';
import JobOrderList from '../components/JobOrderList';
import JobOrderForm from '../components/JobOrderForm';

export default function JobOrdersIndex() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    fetchJobOrders()
      .then((data) => setJobs(Array.isArray(data) ? data : data.job_orders || []))
      .catch((e) => setError(e.message || String(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (payload) => {
    try {
      await createJobOrder(payload);
      setCreating(false);
      load();
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this print job?')) return;
    try {
      await deleteJobOrder(id);
      load();
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading print queue…</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Print Queue</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setCreating((c) => !c)}>{creating ? 'Cancel' : 'New Print Job'}</button>
      </div>
      {creating && <JobOrderForm onCancel={() => setCreating(false)} onSubmit={handleCreate} />}
      <JobOrderList jobs={jobs} onDelete={handleDelete} />
    </div>
  );
}
