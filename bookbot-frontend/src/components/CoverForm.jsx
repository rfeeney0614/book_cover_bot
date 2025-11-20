import React, { useState } from 'react';
import BookSelect from './BookSelect';
import FormatSelect from './FormatSelect';

export default function CoverForm({ initial = {}, onCancel, onSubmit }) {
  const [form, setForm] = useState({
    edition: initial.edition || '',
    note: initial.note || '',
    book_id: initial.book_id || '',
    format_id: initial.format_id || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleBookSelect = (bookId) => {
    setForm((f) => ({ ...f, book_id: bookId }));
  };

  const handleFormatSelect = (formatId) => {
    setForm((f) => ({ ...f, format_id: formatId }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(form);
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 8 }}>
        <label>Edition</label>
        <input name="edition" value={form.edition} onChange={handleChange} style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Book</label>
        <BookSelect value={form.book_id} onChange={handleBookSelect} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Note</label>
        <textarea name="note" value={form.note} onChange={handleChange} style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Format</label>
        <FormatSelect value={form.format_id} onChange={handleFormatSelect} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
