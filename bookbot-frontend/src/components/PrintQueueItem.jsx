import React, { useState, memo } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CoverImage from './CoverImage';

function PrintQueueItem({ item, onQuantityChange, onDelete }) {
  const [localQuantity, setLocalQuantity] = useState(item.print_quantity);
  const img = item.image_url || item.thumb_url || null;
  const hasImage = !!img;

  const handleIncrement = async () => {
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    onQuantityChange(item.job_order_id, 'increment');
  };

  const handleDecrement = async () => {
    const newQuantity = localQuantity - 1;
    if (newQuantity > 0) {
      setLocalQuantity(newQuantity);
    }
    onQuantityChange(item.job_order_id, 'decrement');
  };

  return (
    <Card sx={{ 
      display: 'flex',
      opacity: hasImage ? 1 : 0.5,
      bgcolor: hasImage ? 'background.paper' : 'grey.50'
    }}>
      <Box 
        sx={{ 
          width: 175,
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'grey.200'
        }}
      >
        <CoverImage 
          src={img} 
          alt="Cover" 
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
          }} 
        />
      </Box>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {item.book_title}
            </Typography>
            {item.book_author && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                by {item.book_author}
              </Typography>
            )}
            {item.edition && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Edition: {item.edition}
              </Typography>
            )}
            {item.format_name && (
              <Typography variant="body2" color="text.secondary">
                Format: {item.format_name}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Box sx={{ 
              textAlign: 'center',
              px: 2,
              py: 1,
              bgcolor: 'grey.100',
              borderRadius: 1,
              minWidth: 80
            }}>
              <Typography variant="h5" component="div" fontWeight="bold">
                {localQuantity}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                to print
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <IconButton 
                onClick={handleDecrement}
                size="small"
                color="primary"
              >
                <RemoveIcon />
              </IconButton>
              <IconButton 
                onClick={handleIncrement}
                size="small"
                color="primary"
              >
                <AddIcon />
              </IconButton>
              <IconButton 
                onClick={() => onDelete && onDelete(item)}
                size="small"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default memo(PrintQueueItem);