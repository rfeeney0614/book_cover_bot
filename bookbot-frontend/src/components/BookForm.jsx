import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

export default function BookForm({ initial = {}, onCancel, onSubmit }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    author: initial.author || '',
    note: initial.note || '',
    page_count: initial.page_count || '',
    series: initial.series || '',
  });
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const debounceTimer = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    
    // Check for duplicate titles when title changes
    if (name === 'title') {
      setDuplicateWarning(null);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      
      if (value.trim().length > 2) {
        setCheckingDuplicate(true);
        debounceTimer.current = setTimeout(async () => {
          try {
            const { searchBooksByTitle } = await import('../api/books');
            const matches = await searchBooksByTitle(value);
            const exactMatches = matches.filter(
              book => book.title.toLowerCase() === value.toLowerCase() && book.id !== initial.id
            );
            
            if (exactMatches.length > 0) {
              setDuplicateWarning(
                `A book with the title "${exactMatches[0].title}" already exists.`
              );
            }
          } catch (err) {
            console.error('Error checking for duplicate titles:', err);
          } finally {
            setCheckingDuplicate(false);
          }
        }, 500);
      } else {
        setCheckingDuplicate(false);
      }
    }
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
        {duplicateWarning && (
          <Alert severity="warning" sx={{ mb: 1 }}>
            {duplicateWarning}
          </Alert>
        )}
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
