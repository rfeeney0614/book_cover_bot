import React, { useState } from 'react';

export default function JobOrderForm({ initial = {}, onSubmit, onCancel }) {
  const [note, setNote] = useState(initial.note || '');

  const submit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit({ note });
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 12 }}>
      <div>
        <label>Note</label>
        <div>
          <input value={note} onChange={(e) => setNote(e.target.value)} />
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
