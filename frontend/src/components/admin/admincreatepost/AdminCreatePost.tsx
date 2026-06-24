'use client';

import { edenTreatyApi } from '@lib/eden';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import LogoutButton from "@components/auth/logout";

interface PostFormData {
    title: string;
    body: string;
    image: File | null;
}

const CreatePost: React.FC = () => {
    const [formData, setFormData] = useState<PostFormData>({
        title: '',
        body: '',
        image: null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));

            // Create preview URL
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
        if (formData.image) {
            if (formData.image.size > 10000000) {
                alert("image too large")
            }
            else if(formData.title.length > 100){
                alert ("title too long. max 100 characters.")
            }
            else {
                const res = await edenTreatyApi.admin.createpost.post({ title: formData.title, body: formData.body, image: formData.image })
                if (res.status === 201) {
                    alert('Post created successfully! 🎉');
                }
                else {
                    alert(res.error?.value)
                }
            }
        }
        else {
            alert("an image is required.");
        }
        // Reset form
        setFormData({ title: '', body: '', image: null });
        setPreviewUrl(null);
        setIsSubmitting(false);
    };

    return (

<div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow">
        <div className="flex-1">
          <a href="/public/dashboard.html" className="text-3xl font-black font-brand tracking-tighter bg-gradient-to-r from-[#0038a8] to-[#00ced1] bg-clip-text text-transparent cursor-pointer">
            FlexiHire</a>
            <a href="/public/dashboard.html" className="ml-2 font-normal-case text-xl ml-4">
             Admin Dashboard
          </a>

        </div>
        
        <LogoutButton/>
      </div>
        
        <div className="min-h-screen bg-base-200 py-12">
            
            <div className="max-w-2xl mx-auto px-4">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-3xl font-bold mb-8">Create New Post</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-lg font-medium">Title</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter post title"
                                    className="input input-bordered w-full text-lg"
                                    required
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-lg font-medium">Featured Image</span>
                                </label>

                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-xl p-8 hover:border-primary transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
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
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </>
                                        {previewUrl && <img src={previewUrl} alt="Preview" style={{ width: "200px" }} />}
                                    </label>
                                </div>
                            </div>
                            {!formData.image &&
                                <div role="alert" className="alert alert-error alert-soft">
                                    <span>an image is required.</span>
                                </div>}
                            {/* Body */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-lg font-medium">Body</span>
                                </label>
                                <textarea
                                    name="body"
                                    value={formData.body}
                                    onChange={handleInputChange}
                                    placeholder="Write your post content here..."
                                    className="textarea textarea-bordered h-48 w-full resize-y min-h-[200px]"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="btn btn-ghost flex-1"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
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
        </div>
        </div>
    );
};

export default CreatePost;