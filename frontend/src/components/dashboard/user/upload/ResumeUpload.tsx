'use client';
 
import React, { useState } from 'react';
import CertificationList from '@components/dashboard/user/info/certificationlist-parent'


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
    <div className="max-w-5xl mx-auto px-6 pt-0"> 
  
  {/* Grid container */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-0">
    
    {/* --- KALIWANG COLUMN (1/3 width) --- */}
    <div className="md:col-span-1 mt-0"> 
      <div className="card bg-base-100 shadow-md p-6">
        <h3 className="font-bold border-b mb-4 pb-1 text-xs uppercase opacity-50 tracking-widest">
          File Upload
        </h3>

        <div className="space-y-4">
          <div className="form-control">
            <label className="label-text font-bold text-xs mb-1">
              SELECT FILE
            </label>
            
            <input
              type="file"
              className="file-input file-input-bordered file-input-primary file-input-sm w-full"
              onChange={handleFileChange}
              disabled={uploading}
            />
            
            {file && (
              <p className="mt-2 text-xs opacity-60">
                Selected: {file?.name}
              </p>
            )}
          </div>

          <button
            className="btn btn-primary btn-sm w-full mt-2"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </button>

          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'} p-2 text-xs mt-2`}>
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div> 

    {/* --- KANANG COLUMN (2/3 width) --- */}
    <div className="md:col-span-2 space-y-6">
      <CertificationList />
    </div>

  </div> 
</div>
  );
};

export default ResumeUpload;