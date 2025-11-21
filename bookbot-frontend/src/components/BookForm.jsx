import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

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
    <Box component="form" onSubmit={submit} sx={{ maxWidth: 720 }}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Author"
          name="author"
          value={form.author}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Page Count"
          name="page_count"
          value={form.page_count}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          type="number"
        />
        <TextField
          label="Series"
          name="series"
          value={form.series}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Note"
          name="note"
          value={form.note}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          multiline
          rows={3}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button type="submit" variant="contained">Save</Button>
          <Button type="button" onClick={onCancel} variant="outlined">Cancel</Button>
        </Box>
      </Stack>
    </Box>
  );
}
