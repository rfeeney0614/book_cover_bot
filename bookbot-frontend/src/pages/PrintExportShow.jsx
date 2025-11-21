import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPrintExport } from '../api/print_exports';

export default function PrintExportShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exp, setExp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrintExport(id)
      .then((data) => setExp(data))
      .catch((e) => setError(e.message || String(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Loading export…</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;
  if (!exp) return <div style={{ padding: 20 }}>Export not found</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Export #{exp.id}</h2>
      <pre>{JSON.stringify(exp, null, 2)}</pre>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => navigate('/print_exports')}>Back</button>
      </div>
    </div>
  );
}
