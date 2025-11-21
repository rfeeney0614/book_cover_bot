import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { fetchFormats } from '../api/formats';

export default function FormatSelect({ value, onChange }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchFormats()
      .then((data) => {
        if (!active) return;
        const formats = Array.isArray(data.formats) ? data.formats : data;
        setOptions(formats);
      })
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <FormControl fullWidth variant="outlined" disabled={loading}>
      <Select
        value={value || ''}
        onChange={e => onChange && onChange(e.target.value)}
        displayEmpty
        endAdornment={
          loading ? (
            <Box sx={{ pr: 2 }}>
              <CircularProgress size={20} />
            </Box>
          ) : null
        }
      >
        <MenuItem value="">
          <em>-- Select Format --</em>
        </MenuItem>
        {options.map(f => (
          <MenuItem key={f.id} value={f.id}>
            {f.name} ({f.height} cm)
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}