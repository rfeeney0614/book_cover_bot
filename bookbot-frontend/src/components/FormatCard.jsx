import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function FormatCard({ format, onDelete, onSetDefault, onEdit }) {
  const handleDefaultChange = () => {
    if (!format.default && onSetDefault) {
      onSetDefault(format.id);
    }
  };
  return (
    <Card sx={{ mb: 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="div">
              {format.name || `Format ${format.id}`}
            </Typography>
            {format.description && (
              <Typography variant="body2" color="text.secondary">
                {format.description}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Height: {format.height ?? '—'}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={format.default === true || format.default === 1 || format.default === 'true'}
                  onChange={handleDefaultChange}
                  size="small"
                />
              }
              label={<Typography variant="body2">Default</Typography>}
              sx={{ mt: 0.5 }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              onClick={() => onEdit && onEdit(format)}
              size="small"
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => onDelete && onDelete(format.id)}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
