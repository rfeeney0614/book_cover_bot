import React, { useState } from 'react';

export default function FormatForm({ initial = {}, onSubmit, onCancel }) {
  const [name, setName] = useState(initial.name || '');
  const [description, setDescription] = useState(initial.description || '');

  const submit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit({ name, description });
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 12 }}>
      <div>
        <label>Name</label>
        <div>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>
      <div>
        <label>Description</label>
        <div>
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit">Save</button>
        {' '}
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
