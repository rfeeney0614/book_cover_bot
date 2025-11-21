import React, { useState, useEffect } from 'react';
import BookSelect from './BookSelect';
import FormatSelect from './FormatSelect';
import { fetchFormats } from '../api/formats';

export default function CoverForm({ initial = {}, onCancel, onSubmit, disableBookSelect = false }) {
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

  // Pre-select the server default format when creating a new cover
  useEffect(() => {
    let active = true;
    if (!initial.format_id) {
      fetchFormats()
        .then((data) => {
          if (!active) return;
          const formats = Array.isArray(data.formats) ? data.formats : data;
          const def = formats.find((f) => f.default) || formats[0];
          if (def && !form.format_id) {
            setForm((f) => ({ ...f, format_id: def.id }));
          }
        })
        .catch(() => {});
    }
    return () => { active = false; };
    // Intentionally run once on mount; we don't include `form` so we don't loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {disableBookSelect || (initial && initial.id) ? (
          // Editing from the books page or when explicitly disabled: show book as a label
          <div style={{ padding: '8px 10px', background: '#f5f5f5', borderRadius: 4 }}>{initial.book_title || initial.book || form.book_id}</div>
        ) : (
          <BookSelect value={form.book_id} onChange={handleBookSelect} />
        )}
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
