import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function FormatForm({ initial = {}, onSubmit, onCancel }) {
  const [name, setName] = useState(initial.name || '');
  const [height, setHeight] = useState(initial.height || '');
  const [isDefault, setIsDefault] = useState(!!initial.default);
  const [constructionMappings, setConstructionMappings] = useState(
    initial.construction_mappings || []
  );

  const addMapping = () => {
    setConstructionMappings([
      ...constructionMappings,
      { id: null, min_pages: 0, max_pages: 100, construction_model: 1 }
    ]);
  };

  const removeMapping = (index) => {
    setConstructionMappings(constructionMappings.filter((_, i) => i !== index));
  };

  const updateMapping = (index, field, value) => {
    const updated = [...constructionMappings];
    updated[index] = { ...updated[index], [field]: value };
    setConstructionMappings(updated);
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit({ 
      name, 
      height: height ? Number(height) : null, 
      default: isDefault,
      construction_mappings: constructionMappings 
    });
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

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Construction Mappings</Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addMapping}
              variant="outlined"
            >
              Add Mapping
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Define page count ranges and their corresponding construction models
          </Typography>

          <Stack spacing={1}>
            {constructionMappings.map((mapping, index) => (
              <Paper key={index} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <TextField
                    label="Min Pages"
                    type="number"
                    value={mapping.min_pages}
                    onChange={(e) => updateMapping(index, 'min_pages', parseInt(e.target.value) || 0)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Max Pages"
                    type="number"
                    value={mapping.max_pages}
                    onChange={(e) => updateMapping(index, 'max_pages', parseInt(e.target.value) || 0)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Model #"
                    type="number"
                    value={mapping.construction_model}
                    onChange={(e) => updateMapping(index, 'construction_model', parseInt(e.target.value) || 1)}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeMapping(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))}
            {constructionMappings.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No construction mappings defined. Click "Add Mapping" to create one.
              </Typography>
            )}
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button type="submit" variant="contained">Save</Button>
          <Button type="button" onClick={onCancel} variant="outlined">Cancel</Button>
        </Box>
      </Stack>
    </Box>
  );
}
