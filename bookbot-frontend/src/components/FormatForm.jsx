import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function FormatForm({ initial = {}, onSubmit, onCancel }) {
  const [name, setName] = useState(initial.name || '');
  const [height, setHeight] = useState(initial.height || '');
  const [isDefault, setIsDefault] = useState(!!initial.default);

  const submit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit({ name, height: height ? Number(height) : null, default: isDefault });
  };

  return (
    <Box component="form" onSubmit={submit} sx={{ maxWidth: 720 }}>
      <Stack spacing={2}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Height"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          fullWidth
          variant="outlined"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
            />
          }
          label="Default"
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button type="submit" variant="contained">Save</Button>
          <Button type="button" onClick={onCancel} variant="outlined">Cancel</Button>
        </Box>
      </Stack>
    </Box>
  );
}
