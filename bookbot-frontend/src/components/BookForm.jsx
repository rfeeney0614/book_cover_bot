import React, { useState } from 'react';

export default function BookForm({ initial = {}, onCancel, onSubmit }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    author: initial.author || '',
    note: initial.note || '',
    page_count: initial.page_count || '',
    series: initial.series || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      author: form.author,
      note: form.note,
      page_count: form.page_count ? Number(form.page_count) : null,
      series: form.series,
    };
    onSubmit && onSubmit(payload);
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 8 }}>
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Author</label>
        <input name="author" value={form.author} onChange={handleChange} style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Page Count</label>
        <input name="page_count" value={form.page_count} onChange={handleChange} style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Series</label>
        <input name="series" value={form.series} onChange={handleChange} style={{ width: '100%' }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Note</label>
        <textarea name="note" value={form.note} onChange={handleChange} style={{ width: '100%' }} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
