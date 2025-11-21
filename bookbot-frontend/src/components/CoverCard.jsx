import React from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

export default function CoverCard(props) {
  const { cover, onOpen, onDelete } = props;
  // Covers do not have a title
  const img =
    cover.thumb_url ||
    cover.image_url ||
    cover.thumbnail_url ||
    (cover.image_signed_id && cover.image_filename
      ? `http://localhost:3000/rails/active_storage/blobs/redirect/${cover.image_signed_id}/${encodeURIComponent(
          cover.image_filename
        )}`
      : null);

  const altText = img ? 'Cover' : 'Missing image';

  const content = (
    <>
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
          sx={{
            height: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <BrokenImageIcon sx={{ fontSize: 48, color: 'grey.400' }} />
        </Box>
      )}
      <CardContent>
        <Typography variant="body2" color="text.primary" gutterBottom>
          {cover.book_title || cover.book || 'Unknown book'}
        </Typography>
        {cover.edition && (
          <Typography variant="caption" color="text.secondary" display="block">
            Edition: {cover.edition}
          </Typography>
        )}
        {cover.format_name && (
          <Typography variant="caption" color="text.secondary" display="block">
            Format: {cover.format_name}
          </Typography>
        )}
      </CardContent>
    </>
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

      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
        {hasJobOrder ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`${cover.print_quantity || 0} queued`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); props.onQuantityChange && props.onQuantityChange(cover.job_order_id, 'decrement'); }}
              title="Decrease quantity"
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); props.onQuantityChange && props.onQuantityChange(cover.job_order_id, 'increment'); }}
              title="Increase quantity"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Button
            size="small"
            variant="outlined"
            color="success"
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); props.onAddToQueue && props.onAddToQueue(cover.id); }}
          >
            Add to queue
          </Button>
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
      </CardActions>
    </Card>
  );
}
