// API configuration
const API_HOST = process.env.REACT_APP_API_HOST || 'localhost';
const API_PORT = process.env.REACT_APP_API_PORT || '3001';
const API_PROTOCOL = process.env.REACT_APP_API_PROTOCOL || 'http';

// In production (when served by Rails), use relative URLs (same origin)
// In development, use explicit host:port for cross-origin requests
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : `${API_PROTOCOL}://${API_HOST}:${API_PORT}`;
