import axiosInstance from './axiosInstance';
import axios from 'axios';

/**
 * Session API functions
 */

// Get session details by ID
export const getSessionDetails = async (sessionId) => {
  try {
    const response = await axiosInstance.get(`/api/session/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch session details');
  }
};

// Request presigned URL for file upload
export const requestUploadUrl = async (sessionId, filename, contentType, pageCount, colorMode) => {
  try {
    const response = await axiosInstance.post(`/api/session/${sessionId}/upload-request`, {
      filename,
      contentType,
      pageCount,
      colorMode,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get upload URL');
  }
};

// Upload file directly to S3 using presigned URL
export const uploadFileToS3 = async (presignedUrl, file, onProgress) => {
  try {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) {
          onProgress(percentCompleted);
        }
      },
    });
    return true;
  } catch (error) {
    throw new Error('Failed to upload file to S3');
  }
};

// Create Razorpay order
export const createPaymentOrder = async (sessionId, amount) => {
  try {
    const response = await axiosInstance.post(`/api/session/${sessionId}/create-order`, {
      amount,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create payment order');
  }
};

// Complete payment verification
export const completePayment = async (sessionId, paymentData) => {
  try {
    const response = await axiosInstance.post(`/api/session/${sessionId}/payment/complete`, paymentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
};

// Get print job status
export const getJobStatus = async (sessionId) => {
  try {
    const response = await axiosInstance.get(`/api/session/${sessionId}/status`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch job status');
  }
};

// Poll job status with interval
export const pollJobStatus = (sessionId, callback, interval = 2000) => {
  const intervalId = setInterval(async () => {
    try {
      const status = await getJobStatus(sessionId);
      callback(status);
      
      // Stop polling if job is completed or failed
      if (status.status === 'COMPLETED' || status.status === 'FAILED') {
        clearInterval(intervalId);
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, interval);
  
  return intervalId; // Return interval ID so it can be cleared
};