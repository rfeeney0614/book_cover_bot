import React, { useEffect, useState } from 'react';
import { fetchFormats, createFormat, deleteFormat } from '../api/formats';
import FormatList from '../components/FormatList';
import FormatForm from '../components/FormatForm';

export default function FormatsIndex() {
  const [formats, setFormats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    fetchFormats()
      .then((data) => setFormats(Array.isArray(data) ? data : data.formats || []))
      .catch((e) => setError(e.message || String(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (payload) => {
    try {
      await createFormat(payload);
      setCreating(false);
      load();
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this format?')) return;
    try {
      await deleteFormat(id);
      load();
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading formats…</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Formats</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setCreating((c) => !c)}>{creating ? 'Cancel' : 'New Format'}</button>
      </div>
      {creating && <FormatForm onCancel={() => setCreating(false)} onSubmit={handleCreate} />}
      <FormatList formats={formats} onDelete={handleDelete} />
    </div>
  );
}
