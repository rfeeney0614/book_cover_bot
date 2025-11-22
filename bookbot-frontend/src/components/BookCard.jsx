import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import DeleteIcon from '@mui/icons-material/Delete';

export default function BookCard({ book, onDelete }) {
  const title = book.title || book.name || 'Untitled';
  const author = book.author || book.authors || '';

  // Prefer the first cover attached to the book, fall back to legacy urls
  let img = null;
  if (book.covers && Array.isArray(book.covers) && book.covers.length > 0) {
    const first = book.covers[0];
    img = first.image_url || first.thumb_url || first.thumbnail_url || null;
  }
  // server may provide a single representative `cover` object on books index
  if (!img && book.cover) {
    const c = book.cover;
    img = c.image_url || c.thumb_url || null;
  }
  img = img || book.cover_url || book.image_url || book.thumbnail_url || null;

  const content = (
    <>
      {img ? (
        <CardMedia
          component="img"
          height="160"
          image={img}
          alt={title}
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
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600, lineHeight: 1.2 }}>
          {title}
        </Typography>
        {author && (
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 400 }}>
            {author}
          </Typography>
        )}
      </CardContent>
    </>
  );

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
      <Box
        component={Link}
        to={`/books/${book.id}`}
        sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 1, display: 'flex', flexDirection: 'column' }}
      >
        {content}
      </Box>
      
      {onDelete && (
        <CardActions sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(book);
            }}
            title="Delete book"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
}
