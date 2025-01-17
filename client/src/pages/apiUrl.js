import axios from 'axios';

// Create an Axios instance with default configuration
export const apiClient = axios.create({
  baseURL: 'http://localhost:3500/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Uncomment if cookies are needed
});


