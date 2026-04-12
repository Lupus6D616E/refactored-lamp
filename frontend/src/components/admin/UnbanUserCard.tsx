'use client';

import React, { useState } from 'react';
import { authClient } from '@lib/auth-client';
interface UnbanUserCardProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export default function UnbanUserCard({ onSuccess, onError }: UnbanUserCardProps) {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUnban = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId.trim()) {
      setMessage({ type: 'error', text: 'User ID is required' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await authClient.admin.unbanUser({
        userId: userId.trim(),
      });

      if (error) {
        throw error;
      }

      setMessage({ 
        type: 'success', 
        text: `User ${userId} has been unbanned successfully.` 
      });

      // Clear form
      setUserId('');

      onSuccess?.();
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to unban user';
      setMessage({ type: 'error', text: errorMsg });
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl flex items-center gap-2">
          <span>Unban User</span>
          <div className="badge badge-success badge-sm">Restore Access</div>
        </h2>
        
        <p className="text-base-content/70 mb-6">
          Remove ban from a user and allow them to sign in again.
        </p>

        <form onSubmit={handleUnban} className="space-y-5">
          {/* User ID */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">User ID</span>
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="usr_xxxxxxxxxxxx"
              className="input input-bordered w-full"
              required
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Enter the User ID you want to unban
              </span>
            </label>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`alert ${
                message.type === 'success' ? 'alert-success' : 'alert-error'
              }`}
            >
              <span>{message.text}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="card-actions pt-4">
            <button
              type="submit"
              disabled={loading || !userId.trim()}
              className="btn btn-success btn-block"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Unbanning...
                </>
              ) : (
                'Unban User'
              )}
            </button>
          </div>
        </form>

        <div className="text-xs text-center text-base-content/50 mt-6">
          The user will be able to log in immediately after unbanning.
        </div>
      </div>
    </div>
  );
}