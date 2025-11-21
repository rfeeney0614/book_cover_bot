import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

export default function BookCard({ book }) {
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

  return (
    <Card 
      component={Link} 
      to={`/books/${book.id}`} 
      sx={{ 
        textDecoration: 'none', 
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
    </Card>
  );
}
