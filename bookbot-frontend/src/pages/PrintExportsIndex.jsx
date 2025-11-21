import React, { useEffect, useState } from 'react';
import { fetchPrintExports, createPrintExport, deletePrintExport } from '../api/print_exports';
import PrintExportList from '../components/PrintExportList';
import PrintExportForm from '../components/PrintExportForm';

export default function PrintExportsIndex() {
  const [exportsList, setExportsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    fetchPrintExports()
      .then((data) => setExportsList(Array.isArray(data) ? data : data.print_exports || []))
      .catch((e) => setError(e.message || String(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (payload) => {
    try {
      await createPrintExport(payload);
      setCreating(false);
      load();
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this export?')) return;
    try {
      await deletePrintExport(id);
      load();
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading exports…</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Print Exports</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setCreating((c) => !c)}>{creating ? 'Cancel' : 'New Export'}</button>
      </div>
      {creating && <PrintExportForm onCancel={() => setCreating(false)} onSubmit={handleCreate} />}
      <PrintExportList exportsList={exportsList} onDelete={handleDelete} />
    </div>
  );
}
