import React, { useState, useEffect } from 'react';
import { Printer, Clock, DollarSign, FileText, Upload, Loader } from 'lucide-react';
import { getSessionDetails } from '../api/sessionApi';
import { formatTimeRemaining, isSessionExpired } from '../utils/helpers';

const HomePage = ({ sessionId, onNavigate, session, setSession, setToast }) => {
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await getSessionDetails(sessionId);
        setSession(data);
        
        if (isSessionExpired(data.expiresAt)) {
          setToast({ message: 'Session has expired', type: 'error' });
        }
      } catch (error) {
        setToast({ message: error.message, type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
  }, [sessionId, setSession, setToast]);

  useEffect(() => {
    if (!session?.expiresAt) return;
    
    const interval = setInterval(() => {
      const remaining = formatTimeRemaining(session.expiresAt);
      setTimeRemaining(remaining);
      
      if (remaining === 'Expired') {
        clearInterval(interval);
        setToast({ message: 'Session has expired', type: 'error' });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [session, setToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold">Session not found</p>
          <p className="text-gray-500 mt-2">Please scan a valid QR code</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-full shadow-lg">
            <Printer size={48} className="text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ATP Printing System
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Any Time Printing - Quick & Easy</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Printer className="text-blue-500" size={24} />
            <div>
              <h2 className="text-xl font-semibold dark:text-white">{session.printerName}</h2>
              <p className="text-sm text-gray-500">Session: {sessionId.slice(0, 8)}...</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
            <Clock size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{timeRemaining}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={18} className="text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Price per page</span>
            </div>
            <p className="text-2xl font-bold dark:text-white">₹{session.pricePerPage}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Print Options</span>
            </div>
            <p className="text-sm font-medium dark:text-white">{session.colorOptions.join(', ')}</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('upload')}
          disabled={timeRemaining === 'Expired'}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Upload size={20} />
          Start Printing
        </button>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Supported formats: PDF, DOCX, JPG, PNG</p>
        <p>Maximum file size: 10 MB</p>
      </div>
    </div>
  );
};

export default HomePage;