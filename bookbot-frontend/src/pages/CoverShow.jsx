import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCover, updateCover, deleteCover } from '../api/covers';
import CoverForm from '../components/CoverForm';

export default function CoverShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchCover(id)
      .then((data) => { if (mounted) setCover(data); })
      .catch((e) => setError(e.message || String(e)))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  const handleUpdate = async (payload) => {
    setError(null);
    try {
      const updated = await updateCover(id, payload);
      setCover(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message || String(err));
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this cover?')) return;
    try {
      await deleteCover(id);
      navigate('/covers');
    } catch (err) {
      setError(err.message || String(err));
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading cover…</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;
  if (!cover) return <div style={{ padding: 20 }}>Cover not found.</div>;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)}>Back</button>
      <h2>{cover.title || 'Untitled'}</h2>
      {!editing ? (
        <div>
          <div><strong>Book ID:</strong> {cover.book_id}</div>
          <div style={{ marginTop: 12 }}><strong>Note:</strong>
            <div style={{ whiteSpace: 'pre-wrap' }}>{cover.note}</div>
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={handleDelete} style={{ marginLeft: 8 }}>Delete</button>
          </div>
        </div>
      ) : (
        <CoverForm initial={cover} onCancel={() => setEditing(false)} onSubmit={handleUpdate} />
      )}
    </div>
  );
}
