import React, { useState } from 'react';

export default function PrintExportForm({ initial = {}, onSubmit, onCancel }) {
  const [name, setName] = useState(initial.name || '');

  const submit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit({ name });
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 12 }}>
      <div>
        <label>Name</label>
        <div>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit">Create</button>
        {' '}
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
