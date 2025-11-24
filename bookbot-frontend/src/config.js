// API configuration
const API_HOST = import.meta.env.VITE_API_HOST || 'localhost';
const API_PORT = import.meta.env.VITE_API_PORT || '3000';
const API_PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';

// In production (when served by Rails), use relative URLs (same origin)
// In development, use explicit host:port for cross-origin requests
export const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? '' 
  : `${API_PROTOCOL}://${API_HOST}:${API_PORT}`;
