import React, { useState, memo } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CoverImage from './CoverImage';

function PrintQueueItem({ item, onQuantityChange, onDelete, onImageUpload }) {
  const [localQuantity, setLocalQuantity] = useState(item.print_quantity);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dragCounter = React.useRef(0);
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

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      setUploading(true);
      try {
        await onImageUpload?.(item.id, files[0]);
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        await onImageUpload?.(item.id, file);
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Card sx={{ 
      display: 'flex',
      opacity: hasImage ? 1 : 0.5,
      bgcolor: hasImage ? 'background.paper' : 'grey.50'
    }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id={`print-queue-upload-${item.id}`}
      />
      <Box 
        component={hasImage ? 'div' : 'label'}
        htmlFor={hasImage ? undefined : `print-queue-upload-${item.id}`}
        sx={{ 
          width: 175,
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'grey.200',
          cursor: hasImage ? 'default' : 'pointer',
          '&:hover': hasImage ? {} : {
            bgcolor: 'grey.300',
          }
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {hasImage ? (
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
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 233,
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
            <Typography variant="caption" color="text.secondary" textAlign="center" px={2}>
              Click or drag to upload
            </Typography>
          </Box>
        )}
        {uploading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        )}
        {isDragging && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(25, 118, 210, 0.9)',
              border: '3px dashed white',
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: 'white' }} />
          </Box>
        )}
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
            {item.construction_model && (
              <Typography variant="body2" color="primary" fontWeight="medium">
                Model: {item.construction_model}
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
              {onImageUpload && !hasImage && (
                <IconButton
                  component="label"
                  size="small"
                  color="primary"
                  title="Upload image"
                  disabled={uploading}
                >
                  <CloudUploadIcon />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </IconButton>
              )}
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