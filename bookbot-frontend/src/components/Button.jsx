import React from 'react';
import MuiButton from '@mui/material/Button';

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  title,
  ...props
}) {
  // Map custom variant names to MUI variants
  const muiVariant = variant === 'destructive' ? 'contained' : variant === 'primary' ? 'contained' : 'outlined';
  const color = variant === 'destructive' ? 'error' : variant === 'primary' ? 'primary' : 'inherit';
  const muiSize = size === 'sm' ? 'small' : 'medium';

  return (
    <MuiButton
      variant={muiVariant}
      color={color}
      size={muiSize}
      disabled={disabled}
      onClick={onClick}
      title={title}
      {...props}
    >
      {children}
    </MuiButton>
  );
}
