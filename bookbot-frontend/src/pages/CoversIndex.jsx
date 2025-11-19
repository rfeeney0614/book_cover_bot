import React, { useEffect, useState } from 'react';
import { fetchCovers, createCover, deleteCover } from '../api/covers';
import CoverList from '../components/CoverList';
import CoverForm from '../components/CoverForm';

export default function CoversIndex() {
  const [covers, setCovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    fetchCovers()
      .then((data) => setCovers(Array.isArray(data) ? data : data.covers || []))
      .catch((e) => setError(e.message || String(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (payload) => {
    try {
      await createCover(payload);
      setCreating(false);
      load();
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this cover?')) return;
    try {
      await deleteCover(id);
      load();
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading covers…</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Covers</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setCreating((c) => !c)}>{creating ? 'Cancel' : 'New Cover'}</button>
      </div>
      {creating && <CoverForm onCancel={() => setCreating(false)} onSubmit={handleCreate} />}
      <CoverList covers={covers} />
    </div>
  );
}
