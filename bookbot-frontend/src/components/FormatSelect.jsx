import React, { useState, useEffect } from 'react';
import { fetchFormats } from '../api/formats';

export default function FormatSelect({ value, onChange }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchFormats()
      .then((data) => {
        if (!active) return;
        const formats = Array.isArray(data.formats) ? data.formats : data;
        setOptions(formats);
      })
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <div style={{ position: 'relative', minWidth: 220 }}>
      <select
        value={value || ''}
        onChange={e => onChange && onChange(e.target.value)}
        style={{ width: '100%' }}
      >
        <option value="">-- Select Format --</option>
        {options.map(f => (
          <option key={f.id} value={f.id}>{f.name} ({f.height} cm)</option>
        ))}
      </select>
      {loading && <div style={{ position: 'absolute', right: 8, top: 8, fontSize: 12 }}>Loading…</div>}
    </div>
  );
}