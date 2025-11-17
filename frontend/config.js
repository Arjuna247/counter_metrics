// Configuration for frontend
// This file should be loaded before script.js in index.html

// Set backend URL based on environment
// For Docker: use internal hostname
// For local development: use localhost with exposed port
window.BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3002'  // Exposed Docker port
  : 'http://backend:3001';    // Docker internal network
