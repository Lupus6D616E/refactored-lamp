'use client';

import { useState } from 'react';
import { authClient } from '@lib/auth-client';

export default function UpdateProfileCard() {
  const { data: session, refetch } = authClient.useSession();
  const user = session?.user;

  const [address, setAddress] = useState(user?.address ?? '');
  const [education, setEducation] = useState(user?.education ?? '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await authClient.updateUser({
        address: address.trim() || undefined,
        education: education.trim() || undefined,
      });

      // Optionally refetch session to get updated user data immediately
      await refetch();

      setMessage('Profile updated successfully!');
    } catch (error: any) {
      setMessage(error?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">Update Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">address</span>
              </label>
              <input
                type="text"
                placeholder="123 juan street, manila"
                className="input input-bordered w-full"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">education</span>
              </label>
              <input
                type="text"
                placeholder="Juan state university"
                className="input input-bordered w-full"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                disabled={loading}
              />
            </div>

            {message && (
              <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                <span>{message}</span>
              </div>
            )}

            <div className="card-actions justify-end mt-6">
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}