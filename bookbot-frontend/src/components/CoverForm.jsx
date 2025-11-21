import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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
    <Box component="form" onSubmit={submit} sx={{ maxWidth: 720 }}>
      <Stack spacing={2}>
        <TextField
          label="Edition"
          name="edition"
          value={form.edition}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Book
          </Typography>
          {disableBookSelect ? (
            <Box sx={{ p: 1.5, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">
                {initial.book_title || initial.book || form.book_id}
              </Typography>
            </Box>
          ) : (
            <BookSelect value={form.book_id} onChange={handleBookSelect} />
          )}
        </Box>
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
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Format
          </Typography>
          <FormatSelect value={form.format_id} onChange={handleFormatSelect} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button type="submit" variant="contained">Save</Button>
          <Button type="button" onClick={onCancel} variant="outlined">Cancel</Button>
        </Box>
      </Stack>
    </Box>
  );
}
