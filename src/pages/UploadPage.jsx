import React, { useState } from 'react';
import { Upload, Loader, ArrowLeft, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const UploadPage = ({ sessionId, onNavigate, setUploadData, setToast }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [colorMode, setColorMode] = useState('BW');
  const [dragActive, setDragActive] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                       'image/jpeg', 'image/jpg', 'image/png'];
    
    if (!validTypes.includes(selectedFile.type)) {
      setToast({ 
        message: 'Invalid file type. Please upload PDF, DOCX, JPG, or PNG', 
        type: 'error' 
      });
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setToast({ 
        message: 'File size must be less than 10 MB', 
        type: 'error' 
      });
      return;
    }

    setFile(selectedFile);
    setPageCount(Math.floor(Math.random() * 10) + 1);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sessionId', sessionId);
      formData.append('pageCount', pageCount);
      formData.append('colorMode', colorMode);

      const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const data = response.data.data;
        
        setCloudinaryUrl(data.cloudinaryUrl);
        setQrCodeUrl(data.qrCodeUrl);
        setUploadComplete(true);

        setUploadData({
          filename: data.fileName,
          pageCount: data.pageCount,
          colorMode: data.colorMode,
          totalCost: data.amount,
          cloudinaryUrl: data.cloudinaryUrl,
          qrCodeUrl: data.qrCodeUrl,
        });

        setToast({ message: 'File uploaded successfully!', type: 'success' });

        setTimeout(() => {
          onNavigate('payment');
        }, 2000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setToast({ 
        message: error.response?.data?.message || 'Upload failed. Please try again.', 
        type: 'error' 
      });
    } finally {
      setUploading(false);
    }
  };

  const totalCost = pageCount * (colorMode === 'Color' ? 5.00 : 2.50);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <button
        onClick={() => onNavigate('home')}
        className="text-blue-500 hover:text-blue-600 flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold dark:text-white">Upload Your Document</h2>

        {!uploadComplete ? (
          <>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <input
                type="file"
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                disabled={uploading}
              />
              <label
                htmlFor="file-input"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload size={48} className="text-gray-400 mb-4" />
                {file ? (
                  <div className="text-center">
                    <p className="font-medium dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Click to select a file or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, DOCX, JPG, PNG (max 10MB)
                    </p>
                  </>
                )}
              </label>
            </div>

            {file && (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-white">
                      Number of Pages
                    </label>
                    <input
                      type="number"
                      value={pageCount}
                      onChange={(e) => setPageCount(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      disabled={uploading}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-white">
                      Color Mode
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setColorMode('BW')}
                        disabled={uploading}
                        className={`py-3 rounded-lg border-2 transition-all ${
                          colorMode === 'BW'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <p className="font-medium dark:text-white">Black & White</p>
                        <p className="text-sm text-gray-500">₹2.50/page</p>
                      </button>
                      <button
                        onClick={() => setColorMode('Color')}
                        disabled={uploading}
                        className={`py-3 rounded-lg border-2 transition-all ${
                          colorMode === 'Color'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <p className="font-medium dark:text-white">Color</p>
                        <p className="text-sm text-gray-500">₹5.00/page</p>
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Total Pages:</span>
                      <span className="font-semibold dark:text-white">{pageCount}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Mode:</span>
                      <span className="font-semibold dark:text-white">{colorMode}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-400">Estimated Cost:</span>
                      <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                        ₹{totalCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Uploading to Cloud...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Upload & Continue
                    </>
                  )}
                </button>
              </>
            )}
          </>
        ) : (
          <div className="text-center space-y-4 py-8 animate-bounce-in">
            <CheckCircle size={64} className="text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
              Upload Successful!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your file has been uploaded to Cloudinary
            </p>
            <p className="text-sm text-gray-500">Redirecting to payment...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;