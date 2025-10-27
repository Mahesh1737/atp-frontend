import React, { useState, useEffect } from 'react';
import { CreditCard, Loader, ArrowLeft, Shield } from 'lucide-react';
import { createPaymentOrder, completePayment } from '../api/sessionApi';
import { loadRazorpayScript } from '../utils/helpers';

const PaymentPage = ({ sessionId, onNavigate, uploadData, setToast }) => {
  const [processing, setProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const loadScript = async () => {
      const loaded = await loadRazorpayScript();
      setRazorpayLoaded(loaded);
      if (!loaded) {
        setToast({ 
          message: 'Failed to load payment gateway. Please refresh.', 
          type: 'error' 
        });
      }
    };
    loadScript();
  }, [setToast]);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      setToast({ message: 'Payment gateway not loaded', type: 'error' });
      return;
    }

    setProcessing(true);

    try {
      // Step 1: Create order on backend
      const orderData = await createPaymentOrder(
        sessionId,
        Math.round(uploadData.totalCost * 100) // Convert to paise
      );

      // Step 2: Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'ATP Printing System',
        description: `Print Job - ${uploadData.pageCount} pages`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // Step 3: Verify payment on backend
            await completePayment(sessionId, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            setToast({ message: 'Payment successful!', type: 'success' });
            onNavigate('status');
          } catch (error) {
            setToast({ message: error.message, type: 'error' });
            setProcessing(false);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#3b82f6',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            setToast({ message: 'Payment cancelled', type: 'error' });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
      setProcessing(false);
    }
  };

  if (!uploadData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold">No upload data found</p>
          <button
            onClick={() => onNavigate('upload')}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  const pricePerPage = uploadData.colorMode === 'Color' ? 5.00 : 2.50;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <button
        onClick={() => onNavigate('upload')}
        disabled={processing}
        className="text-blue-500 hover:text-blue-600 flex items-center gap-2 transition-colors disabled:opacity-50"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold dark:text-white">Payment</h2>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
          <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">Total Amount</p>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            ₹{uploadData.totalCost.toFixed(2)}
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">File:</span>
              <span className="font-medium dark:text-white">{uploadData.filename}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Pages:</span>
              <span className="font-medium dark:text-white">{uploadData.pageCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Color Mode:</span>
              <span className="font-medium dark:text-white">{uploadData.colorMode}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Price per page:</span>
              <span className="font-medium dark:text-white">₹{pricePerPage.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <span className="font-semibold dark:text-white">Total Amount:</span>
            <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
              ₹{uploadData.totalCost.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={processing || !razorpayLoaded}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <Loader className="animate-spin" size={20} />
              Processing...
            </>
          ) : (
            <>
              <CreditCard size={20} />
              Pay with Razorpay
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Shield size={16} />
          Secure payment powered by Razorpay
        </div>

        <div className="text-xs text-center text-gray-400 space-y-1">
          <p>By proceeding, you agree to our terms and conditions</p>
          <p>Your payment is secure and encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;