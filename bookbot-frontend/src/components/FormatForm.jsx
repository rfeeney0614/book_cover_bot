import React, { useState } from 'react';

export default function FormatForm({ initial = {}, onSubmit, onCancel }) {
  const [name, setName] = useState(initial.name || '');
  const [height, setHeight] = useState(initial.height || '');
  const [isDefault, setIsDefault] = useState(!!initial.default);

  const submit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit({ name, height: height ? Number(height) : null, default: isDefault });
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 12, minWidth: 320 }}>
      <div style={{ marginBottom: 8 }}>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Height</label>
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} />
          Default
        </label>
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
