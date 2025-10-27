import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import PaymentPage from './pages/PaymentPage';
import StatusPage from './pages/StatusPage';
import Toast from './components/Toast';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [sessionId] = useState('abc123def456'); // In production, get from URL
  const [session, setSession] = useState(null);
  const [uploadData, setUploadData] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Get session ID from URL in production
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const sessionIndex = pathParts.indexOf('session');
    if (sessionIndex !== -1 && pathParts[sessionIndex + 1]) {
      // setSessionId(pathParts[sessionIndex + 1]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="absolute top-4 right-4">
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>

      <div className="py-8">
        {currentPage === 'home' && (
          <HomePage
            sessionId={sessionId}
            onNavigate={setCurrentPage}
            session={session}
            setSession={setSession}
            setToast={setToast}
          />
        )}
        {currentPage === 'upload' && (
          <UploadPage
            sessionId={sessionId}
            onNavigate={setCurrentPage}
            setUploadData={setUploadData}
            setToast={setToast}
          />
        )}
        {currentPage === 'payment' && (
          <PaymentPage
            sessionId={sessionId}
            onNavigate={setCurrentPage}
            uploadData={uploadData}
            setToast={setToast}
          />
        )}
        {currentPage === 'status' && (
          <StatusPage sessionId={sessionId} setToast={setToast} />
        )}
      </div>
    </div>
  );
}