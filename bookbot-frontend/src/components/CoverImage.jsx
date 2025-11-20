import React from 'react';
import { FaImage } from 'react-icons/fa';
import { MdBrokenImage } from 'react-icons/md';

export default function CoverImage({ src, alt, style }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 8 }}>
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{ maxWidth: 120, maxHeight: 120, borderRadius: 4, boxShadow: '0 1px 4px #ccc', ...style }}
        />
      ) : (
        <div
          style={{
            width: 120,
            height: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed #ccc',
            borderRadius: 4,
            boxShadow: '0 1px 4px #ccc',
            ...style,
          }}
        >
          <MdBrokenImage size={48} color="#ccc" />
        </div>
      )}
    </div>
  );
}