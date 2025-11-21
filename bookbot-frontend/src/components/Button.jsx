import React from 'react';

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  title,
  style = {},
  ...props
}) {
  const base = {
    padding: size === 'sm' ? '4px 8px' : '8px 12px',
    borderRadius: 6,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: size === 'sm' ? 13 : 14,
    lineHeight: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  };

  const variants = {
    primary: { background: '#2563eb', color: '#fff' },
    secondary: { background: '#fff', color: '#374151', border: '1px solid #d1d5db' },
    destructive: { background: '#dc2626', color: '#fff' },
  };

  const applied = {
    ...base,
    ...(variants[variant] || variants.primary),
    opacity: disabled ? 0.75 : 1,
    ...style,
  };

  return (
    <button
      type="button"
      title={title}
      onClick={disabled ? undefined : onClick}
      style={applied}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
