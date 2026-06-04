'use client';

import { edenTreatyApi } from '@lib/eden';
import React, { useState, ChangeEvent, FormEvent } from 'react';



const UploadProfilePicture: React.FC = () => {

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [image, setImage] = useState<File>();
    const [message, setMessage] = useState<string | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create preview URL
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        if (image) {
            const res: any = await edenTreatyApi.user.uploadprofilepicture.post({ file: image });
            if (res.status === 201) {
                setMessage('Profile picture updated successfully!');
            } else {
                const errorMessage =
                    typeof res?.error === 'string'
                        ? res.error
                        : res?.error && typeof res.error === 'object' && 'message' in res.error && typeof res.error.message === 'string'
                        ? res.error.message
                        : res?.error && typeof res.error === 'object' && 'value' in res.error
                        ? String((res.error as { value: unknown }).value)
                        : 'Failed to upload profile picture.';
                setMessage(errorMessage);
            }
        } else {
            setMessage('An image is required.');
        }

        // Reset form
        setPreviewUrl(null);
        setIsSubmitting(false);
    };

    return (
        
           <div className="space-y-6">
  <div className="card bg-base-100 shadow-md p-6 ">
    {/* Header Style - Match sa General Information */}
    <h3 className="font-bold border-b mb-4 pb-1 text-xs uppercase opacity-50 tracking-widest">
      Upload Profile Picture
    </h3>

    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload Area */}
      <div className="form-control">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-all group cursor-pointer relative overflow-hidden">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            id="image-upload"
            required
          />

          <div className="flex flex-col items-center text-center">
            {previewUrl ? (
              <div className="relative">
                <div className="avatar mb-2">
                  <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={previewUrl} alt="Preview" />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-primary uppercase">Change photo</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-base-200 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span className="text-xl">📸</span>
                </div>
                <p className="text-xs font-bold opacity-60 uppercase">Click to browse</p>
                <p className="text-[10px] opacity-40 uppercase">Max 5MB</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Button - Match sa Save Changes button style */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary btn-sm w-full mt-2"
      >
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner loading-xs"></span>
            Updating...
          </>
        ) : (
          "Update Photo"
        )}
      </button>
    </form>

    {/* Message indicator if any */}
    {message && (
      <p className="text-center text-[10px] mt-4 opacity-60 italic">{message}</p>
    )}
  </div>
</div>
    );
};

export default UploadProfilePicture;