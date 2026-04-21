'use client';

import { edenTreatyApi } from '@lib/eden';
import React, { useState, ChangeEvent, FormEvent } from 'react';

interface props{
    selectedId: string
}

const UploadBusinessProfilePictures = ({selectedId}:props) => {

    const [previewProfilePictureUrl, setPreviewProfilePictureUrl] = useState<string | null>(null);
    const [previewBannerPictureUrl, setPreviewBannerPictureUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [businessProfilePicture, setBusinessProfilePicture] = useState<File>()
    const [businessBannerPicture, setBusinessBannerPicture] = useState<File>()

    const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create preview URL
            setBusinessProfilePicture(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewProfilePictureUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create preview URL
            setBusinessBannerPicture(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewBannerPictureUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (businessBannerPicture && businessProfilePicture) {
            const res = await edenTreatyApi.business.changepicture.post({businessId: selectedId, profilePicture: businessProfilePicture, bannerPicture: businessBannerPicture})
            if(res.status === 201){
            alert('Banner and Profile Picture changed 🎉');
            }
            else{
                alert(res.error)
            }
        }
        else{
            window.alert("an image is required.")
        }
        // Reset form
        setPreviewBannerPictureUrl(null);
        setPreviewProfilePictureUrl(null);
        setIsSubmitting(false);
    };

    return (
        
            <div className="max-w-2xl mx-auto px-4">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-3xl font-bold mb-8">Upload Profile Picture</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                           

                            {/* Image Upload */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-lg font-medium">Business Profile Picture</span>
                                </label>

                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-xl p-8 hover:border-primary transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="hidden"
                                        id="image-upload"
                                        required
                                    />

                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        <>
                                            <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
                                                📸
                                            </div>
                                            <p className="text-base-content/70 mb-1">
                                                Click to upload image
                                            </p>
                                            <p className="text-sm text-base-content/50">
                                                PNG, JPG, GIF up to 5MB
                                            </p>
                                        </>
                                        {previewProfilePictureUrl && <img src={previewProfilePictureUrl} alt="Preview" style={{ width: "200px" }} />}
                                    </label>
                                </div>
                            </div>
                             <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-lg font-medium">Business Banner Picture</span>
                                </label>

                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-xl p-8 hover:border-primary transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBannerChange}
                                        className="hidden"
                                        id="image-upload2"
                                        required
                                    />

                                    <label
                                        htmlFor="image-upload2"
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        <>
                                            <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
                                                📸
                                            </div>
                                            <p className="text-base-content/70 mb-1">
                                                Click to upload image
                                            </p>
                                            <p className="text-sm text-base-content/50">
                                                PNG, JPG, GIF up to 5MB
                                            </p>
                                        </>
                                        {previewBannerPictureUrl && <img src={previewBannerPictureUrl} alt="Preview" style={{ width: "200px" }} />}
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || (!businessBannerPicture) || !businessProfilePicture}
                                    className="btn btn-primary flex-1 text-lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="loading loading-spinner"></span>
                                            Creating Post...
                                        </>
                                    ) : (
                                        'Create Post'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Optional: Tips Card */}
                <div className="mt-8 text-center text-sm text-base-content/60">
                    Posts with engaging images and clear titles get more reach ✨
                </div>
            </div>
    );
};

export default UploadBusinessProfilePictures;