'use client';
 
import React, { useState } from 'react';

const ResumeUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/user/uploadpdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('File uploaded successfully!');
        console.log(result);
        setFile(null); // Optional: clear the selected file
      } else {
        setMessage(`Upload failed: ${response.statusText}`);
      }
    } catch (error) {
      setMessage('Error uploading file. Please try again.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Upload a File</h2>

          <input
            type="file"
            className="file-input file-input-bordered file-input-primary w-full"
            onChange={handleFileChange}
            disabled={uploading}
          />

          {file && <p className="mt-2 text-sm">Selected: {file.name}</p>}

          <div className="card-actions mt-4">
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </button>
          </div>

          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'} mt-4`}>
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;