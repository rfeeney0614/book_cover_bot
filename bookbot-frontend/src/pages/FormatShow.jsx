import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFormat, updateFormat } from '../api/formats';
import FormatForm from '../components/FormatForm';

export default function FormatShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [format, setFormat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFormat(id)
      .then((data) => setFormat(data))
      .catch((e) => setError(e.message || String(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (payload) => {
    try {
      await updateFormat(id, payload);
      navigate('/formats');
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading format…</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;
  if (!format) return <div style={{ padding: 20 }}>Format not found</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Format</h2>
      <FormatForm initial={format} onSubmit={handleUpdate} onCancel={() => navigate('/formats')} />
    </div>
  );
}
