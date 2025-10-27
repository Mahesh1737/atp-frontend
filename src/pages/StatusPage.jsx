import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader, FileText, CreditCard, Printer, Check } from 'lucide-react';
import { pollJobStatus } from '../api/sessionApi';

const StatusPage = ({ sessionId, setToast }) => {
  const [status, setStatus] = useState('PAID');
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { key: 'UPLOADED', label: 'Uploaded', description: 'File uploaded successfully', icon: FileText },
    { key: 'PAID', label: 'Paid', description: 'Payment received', icon: CreditCard },
    { key: 'PRINTING', label: 'Printing', description: 'Sending to printer', icon: Printer },
    { key: 'COMPLETED', label: 'Completed', description: 'Print job completed', icon: Check },
  ];

  useEffect(() => {
    // Poll job status from backend
    const intervalId = pollJobStatus(sessionId, (statusData) => {
      setStatus(statusData.status);
      
      const stepIndex = steps.findIndex(step => step.key === statusData.status);
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex);
      }

      if (statusData.status === 'FAILED') {
        setToast({ message: 'Print job failed', type: 'error' });
      }
    });

    // Cleanup polling on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [sessionId, setToast]);

  // Simulate status progression for demo (remove in production)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 3) {
          setStatus(steps[prev + 1].key);
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold dark:text-white mb-2">Print Job Status</h2>
          <p className="text-gray-600 dark:text-gray-400">Session: {sessionId.slice(0, 8)}...</p>
        </div>

        <div className="relative space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.key} className="relative">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isCompleted || isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle size={24} />
                    ) : isActive ? (
                      <Loader className="animate-spin" size={24} />
                    ) : (
                      <Icon size={24} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <p
                      className={`font-semibold text-lg transition-colors ${
                        isCompleted || isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {step.description}
                    </p>
                    {isActive && (
                      <div className="mt-2">
                        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-6 top-12 w-0.5 h-8 transition-all duration-500 ${
                      index < currentStep
                        ? 'bg-gradient-to-b from-blue-500 to-purple-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {currentStep === 3 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center animate-bounce-in">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
              Print Job Completed!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please collect your documents from the printer.
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150" />
            </div>
          </div>
        )}

        {status === 'FAILED' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <div className="text-red-500 mx-auto mb-3">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">
              Print Job Failed
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Something went wrong. Please contact support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPage;