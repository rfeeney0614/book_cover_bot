import React from 'react';
import Box from '@mui/material/Box';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

export default function CoverImage({ src, alt, style }) {
  return (
    <Box sx={{ width: '100%', bgcolor: 'grey.50' }}>
      {src ? (
        <Box sx={{ width: '100%', height: 160, overflow: 'hidden' }}>
          <Box
            component="img"
            src={src}
            alt={alt}
            sx={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              display: 'block', 
              borderRadius: 0, 
              ...style 
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            height: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 1,
            borderStyle: 'dashed',
            borderColor: 'divider',
            boxShadow: 1,
            ...style,
          }}
        >
          <BrokenImageIcon sx={{ fontSize: 48, color: 'grey.400' }} />
        </Box>
      )}
    </Box>
  );
}