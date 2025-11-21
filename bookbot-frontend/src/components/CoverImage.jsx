import React from 'react';
import { FaImage } from 'react-icons/fa';
import { MdBrokenImage } from 'react-icons/md';

export default function CoverImage({ src, alt, style }) {
  return (
    <div style={{ width: '100%', background: '#fafafa' }}>
      {src ? (
        <div style={{ width: '100%', height: 160, overflow: 'hidden' }}>
          <img
            src={src}
            alt={alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' , borderRadius: 0, ...style }}
          />
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            height: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed #ccc',
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