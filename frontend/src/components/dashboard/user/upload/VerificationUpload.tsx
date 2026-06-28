'use client';
 
import { edenTreatyApi } from '@backend/src/lib/eden';
import React, { useEffect, useState } from 'react';

export const VerificationUpload: React.FC = () => {
  const [disabilityStatus, setDisabilityStatus] = useState<string>("Unverified")
  const [disabilityFile, setDisabilityFile] = useState<File | null>(null);
  const [disabilityUploading, setDisabilityUploading] = useState(false);
  const [disabilityMessage, setDisabilityMessage] = useState<string | null>(null);
  const [studentStatus, setStudentStatus] = useState<string>("Unverified")
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [studentUploading, setStudentUploading] = useState(false);
  const [studentMessage, setStudentMessage] = useState<string | null>(null);
  const [disabilities, setDisabilities] = useState<string[]>([]);
  const [disabilityInput, setDisabilityInput] = useState("");

  useEffect(() =>{
  const getVerificationStatus = async () =>{
    const res = await edenTreatyApi.verify.seeker.status.get()
    if(res.data){
      setDisabilityStatus(res.data.disability)
      setStudentStatus(res.data.student)
    }
  }
  getVerificationStatus()
  },[])
    const addDisability = () => {
    const trimmed = disabilityInput.trim().toLowerCase();
    if (trimmed && !disabilities.includes(trimmed)) {
      setDisabilities((prev) => [...prev, trimmed]);
      setDisabilityInput("");
    }
  };

  const removeDisability /* lmao */ = (disability: string) => {
    setDisabilities((prev) => prev.filter((t) => t !== disability));
  };

  const handleDisabilityFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDisabilityFile(e.target.files[0]);
      setDisabilityMessage(null);
    }
  };
    const handleStudentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setStudentFile(e.target.files[0]);
      setStudentMessage(null);
    }
  };

  const handleDisabilityUpload = async () => {
    if (!disabilityFile) {
      setDisabilityMessage('Please select a file first.');
      return;
    }

    setDisabilityUploading(true);
    setDisabilityMessage(null);

    try {
      const response = await edenTreatyApi.verify.seeker.disability.post({
        document:disabilityFile,
        disabilities: disabilities
      })

      if (response.status === 200) {
        
        setDisabilityMessage('File uploaded successfully!');
        setDisabilityFile(null); // Optional: clear the selected file
      } else {
        setDisabilityMessage(`Upload failed: ${response.error?.status}`);
      }
    } catch (error) {
      setDisabilityMessage('Error uploading file. Please try again.');
      console.error(error);
    } finally {
      setDisabilityUploading(false);
    }
  };

    const handleStudentUpload = async () => {
    if (!studentFile) {
      setStudentMessage('Please select a file first.');
      return;
    }

    setStudentUploading(true);
    setStudentMessage(null);

    try {

      const response = await edenTreatyApi.verify.seeker.student.post({
        document:studentFile,
      })


      if (response.status === 200) {
        setStudentMessage('File uploaded successfully!');
        console.log(response);
        setStudentFile(null); // Optional: clear the selected file
      } else {
        setStudentMessage(`Upload failed: ${response.error?.status}`);
      }
    } catch (error) {
      setStudentMessage('Error uploading file. Please try again.');
      console.error(error);
    } finally {
      setStudentUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-0"> 
  
  {/* Grid container */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-0">
    {  disabilityStatus === "Unverified" &&
    <div className="md:col-span-1 mt-0"> 
      <div className="card bg-base-100 shadow-md p-6">
        <h3 className="font-bold border-b mb-4 pb-1 text-xs uppercase opacity-50 tracking-widest">
          Disability Verification File Upload
        </h3>
          <h3 className="font-bold mb-3 text-xs uppercase opacity-50 tracking-widest">
          Disabilities
        </h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              className="input input-bordered input-sm flex-1 focus:input-primary"
              placeholder="Add disability..."
              value={disabilityInput}
              onChange={(e) => setDisabilityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addDisability();
                }
              }}
            />
            <button
              className="btn btn-primary btn-sm px-6 font-bold"
              onClick={addDisability}
              disabled={!disabilityInput.trim()}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {disabilities.length > 0 ? (
              disabilities.map((disability) => (
                <div key={disability} className="badge badge-outline badge-secondary h-auto py-1.5 px-3 gap-2 text-[11px] font-semibold">
                  {disability}
                  <button
                    className="hover:text-error transition-colors font-bold text-xs"
                    onClick={() => removeDisability(disability)}
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs opacity-50 italic">No disabilities added yet</p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="form-control">
            <label className="label-text font-bold text-xs mb-1">
              SELECT FILE
            </label>
            
            <input
              type="file"
              className="file-input file-input-bordered file-input-primary file-input-sm w-full"
              onChange={handleDisabilityFileChange}
              disabled={disabilityUploading}
            />
            
            {disabilityFile && (
              <p className="mt-2 text-xs opacity-60">
                Selected: {disabilityFile?.name}
              </p>
            )}
          </div>

          <button
            className="btn btn-primary btn-sm w-full mt-2"
            onClick={handleDisabilityUpload}
            disabled={disabilityUploading}
          >
            {disabilityUploading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </button>

          {disabilityMessage && (
            <div className={`alert ${disabilityMessage.includes('success') ? 'alert-success' : 'alert-error'} p-2 text-xs mt-2`}>
              <span>{disabilityMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>} 
    {disabilityStatus === "Pending" && <p>pending</p>}
    {disabilityStatus === "Verified" && <p>verified</p>}
    { studentStatus === "Unverified" &&
    <div className="md:col-span-1 mt-0"> 
      <div className="card bg-base-100 shadow-md p-6">
        <h3 className="font-bold border-b mb-4 pb-1 text-xs uppercase opacity-50 tracking-widest">
          Student Verification File Upload
        </h3>

        <div className="space-y-4">
          <div className="form-control">
            <label className="label-text font-bold text-xs mb-1">
              SELECT FILE
            </label>
            
            <input
              type="file"
              className="file-input file-input-bordered file-input-primary file-input-sm w-full"
              onChange={handleStudentFileChange}
              disabled={studentUploading}
            />
            
            {studentFile && (
              <p className="mt-2 text-xs opacity-60">
                Selected: {studentFile?.name}
              </p>
            )}
          </div>

          <button
            className="btn btn-primary btn-sm w-full mt-2"
            onClick={handleStudentUpload}
            disabled={studentUploading}
          >
            {studentUploading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </button>

          {studentMessage && (
            <div className={`alert ${studentMessage.includes('success') ? 'alert-success' : 'alert-error'}} p-2 text-xs mt-2`}>
              <span>{studentMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div> 
}
    {studentStatus === "Pending" && <p>pending</p>}
    {studentStatus === "Verified" && <p>verified</p>}
  </div> 
</div>
  );
};
