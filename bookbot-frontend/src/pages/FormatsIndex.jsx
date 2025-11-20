import React, { useEffect, useState } from 'react';
import { fetchFormats, createFormat, deleteFormat } from '../api/formats';
import FormatList from '../components/FormatList';
import FormatForm from '../components/FormatForm';
import Modal from '../components/Modal';

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

  const handleSetDefault = async (formatId) => {
    // Optimistically update local state so cards don't reorder on reload.
    const previous = formats;
    setFormats((fs) => fs.map((f) => ({ ...f, default: f.id === formatId })));
    try {
      const res = await fetch(`/api/formats/${formatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ default: true }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Failed to set default (${res.status}): ${text}`);
      }
      // Optionally update the single format from the response to keep timestamps in sync
      try {
        const updated = await res.json().catch(() => null);
        if (updated && updated.id) {
          setFormats((fs) => fs.map((f) => (f.id === updated.id ? { ...f, ...updated } : f)));
        }
      } catch (_) {}
    } catch (e) {
      setError(e.message || String(e));
      // Revert on failure
      setFormats(previous);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading formats…</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Formats</h2>
      <div style={{ marginBottom: 12 }}>
        <button type="button" onClick={() => setCreating(true)}>New Format</button>
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="New Format" width={400}>
        <FormatForm onCancel={() => setCreating(false)} onSubmit={async (payload) => {
          try {
            const created = await (await import('../api/formats')).createFormat(payload);
            setFormats((fs) => [created, ...fs]);
            setCreating(false);
          } catch (e) {
            setError(e.message || String(e));
          }
        }} />
      </Modal>
      <FormatList formats={formats} onDelete={handleDelete} onSetDefault={handleSetDefault} />
    </div>
  );
}
