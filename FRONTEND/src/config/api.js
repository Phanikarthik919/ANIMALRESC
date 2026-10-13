// Dynamically route to local backend when developing on localhost, or production when deployed
const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_URL = isLocal
  ? (import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:5001')
  : (import.meta.env.VITE_API_URL || 'https://animalresc.onrender.com');

export default API_URL;
