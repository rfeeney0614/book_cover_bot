// API configuration
const API_HOST = process.env.REACT_APP_API_HOST || 'localhost';
const API_PORT = process.env.REACT_APP_API_PORT || '3001';
const API_PROTOCOL = process.env.REACT_APP_API_PROTOCOL || 'http';

export const API_BASE_URL = `${API_PROTOCOL}://${API_HOST}:${API_PORT}`;
