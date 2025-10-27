/**
 * Utility helper functions
 */

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Validate file type
export const isValidFileType = (file) => {
  const validTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];
  return validTypes.includes(file.type);
};

// Validate file size (max 10MB)
export const isValidFileSize = (file, maxSizeMB = 10) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Format time remaining
export const formatTimeRemaining = (expiresAt) => {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires - now;
  
  if (diff <= 0) return 'Expired';
  
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Format currency (INR)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

// Calculate total cost
export const calculateTotalCost = (pageCount, colorMode) => {
  const pricePerPage = colorMode === 'Color' ? 5.00 : 2.50;
  return pageCount * pricePerPage;
};

// Get file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Truncate text
export const truncateText = (text, maxLength = 20) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Extract session ID from URL
export const getSessionIdFromUrl = () => {
  const pathParts = window.location.pathname.split('/');
  const sessionIndex = pathParts.indexOf('session');
  if (sessionIndex !== -1 && pathParts[sessionIndex + 1]) {
    return pathParts[sessionIndex + 1];
  }
  return null;
};

// Check if session is expired
export const isSessionExpired = (expiresAt) => {
  const now = new Date();
  const expires = new Date(expiresAt);
  return now >= expires;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Load Razorpay script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Open Razorpay checkout
export const openRazorpayCheckout = (options) => {
  const rzp = new window.Razorpay(options);
  rzp.open();
};  