import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function CoverCard(props) {
  const { cover, onOpen, onDelete, onImageUpload, isQueueLoading } = props;
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dragCounter = React.useRef(0);
  // Covers do not have a title
  const img = cover.image_url || cover.thumb_url || cover.thumbnail_url || null;

  const altText = img ? 'Cover' : 'Missing image';

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
        await onImageUpload?.(cover.id, files[0]);
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
        await onImageUpload?.(cover.id, file);
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        setUploading(false);
      }
    }
  };

  const content = (
    <Box
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{ position: 'relative' }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id={`cover-upload-${cover.id}`}
      />
      {img ? (
        <CardMedia
          component="img"
          height="160"
          image={img}
          alt={altText}
          sx={{ objectFit: 'cover' }}
        />
      ) : (
        <Box
          component="label"
          htmlFor={`cover-upload-${cover.id}`}
          sx={{
            height: 160,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            borderBottom: 1,
            borderColor: 'divider',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'grey.200',
            },
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 1 }} />
          <Typography variant="caption" color="text.secondary">
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
      <CardContent>
        <Typography variant="h6" component="h3" color="text.primary" gutterBottom sx={{ fontWeight: 600, lineHeight: 1.2 }}>
          {cover.book_title || cover.book || 'Unknown book'}
        </Typography>
        {cover.edition && (
          <Typography variant="body2" color="text.primary" display="block" sx={{ fontWeight: 500, mb: 0.5 }}>
            {cover.edition}
          </Typography>
        )}
        {cover.format_name && (
          <Typography variant="caption" color="text.secondary" display="block">
            {cover.format_name}
          </Typography>
        )}
        {cover.construction_model && (
          <Typography variant="caption" color="primary" display="block" sx={{ mt: 0.5, fontWeight: 500 }}>
            Model: {cover.construction_model}
          </Typography>
        )}
      </CardContent>
    </Box>
  );

  // show print quantity and +/- if present
  const hasJobOrder = cover.job_order_id || cover.print_quantity;

  return (
    <Card 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      {onOpen ? (
        <Box
          role="button"
          tabIndex={0}
          onClick={() => onOpen(cover)}
          onKeyPress={(e) => { if (e.key === 'Enter') onOpen(cover); }}
          sx={{ cursor: 'pointer', flexGrow: 1 }}
        >
          {content}
        </Box>
      ) : (
        <Box
          component={Link}
          to={`/covers/${cover.id}`}
          sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
        >
          {content}
        </Box>
      )}

      <CardActions sx={{ flexDirection: 'column', alignItems: 'stretch', px: 2, py: 1.5, gap: 1 }}>
        {hasJobOrder ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); props.onQuantityChange && props.onQuantityChange(cover.job_order_id, 'decrement', cover.id); }}
                title="Decrease quantity"
                disabled={isQueueLoading}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Chip 
                label={`${cover.print_quantity || 0} queued`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); props.onQuantityChange && props.onQuantityChange(cover.job_order_id, 'increment', cover.id); }}
                title="Increase quantity"
                disabled={isQueueLoading}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
              {onImageUpload && (
                <IconButton
                  component="label"
                  size="small"
                  color="primary"
                  title="Upload image"
                  disabled={uploading}
                >
                  <CloudUploadIcon fontSize="small" />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </IconButton>
              )}
              {onDelete && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(cover); }}
                  title="Delete cover"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </>
        ) : (
          <>
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); props.onAddToQueue && props.onAddToQueue(cover.id); }}
              disabled={isQueueLoading}
              fullWidth
            >
              Add to queue
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
              {onImageUpload && (
                <IconButton
                  component="label"
                  size="small"
                  color="primary"
                  title="Upload image"
                  disabled={uploading}
                >
                  <CloudUploadIcon fontSize="small" />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </IconButton>
              )}
              {onDelete && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(cover); }}
                  title="Delete cover"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </>
        )}
      </CardActions>
    </Card>
  );
}
