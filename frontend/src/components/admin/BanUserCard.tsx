'use client';

import { authClient } from '@lib/auth-client';
import React, { useState } from 'react';

interface BanUserCardProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export default function BanUserCard({ onSuccess, onError }: BanUserCardProps) {
  const [userId, setUserId] = useState('');
  const [banReason, setBanReason] = useState('');
  const [duration, setDuration] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleBan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId.trim()) {
      setMessage({ type: 'error', text: 'User ID is required' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const banExpiresIn = duration ? Number(duration) * 3600 : undefined; // convert hours to seconds

      const { data, error } = await authClient.admin.banUser({
        userId: userId.trim(),
        banReason: banReason.trim() || undefined,
        banExpiresIn, // undefined = permanent ban
      });

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: `User ${userId} has been banned successfully.` });
      setUserId('');
      setBanReason('');
      setDuration('');

      onSuccess?.();
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to ban user';
      setMessage({ type: 'error', text: errorMsg });
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl">Ban User</h2>
        <p className="text-base-content/70 mb-4">
          Ban a user from signing in and revoke all their active sessions.
        </p>

        <form onSubmit={handleBan} className="space-y-5">
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
                The unique ID of the user (from your users table)
              </span>
            </label>
          </div>

          {/* Ban Reason */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Ban Reason (optional)</span>
            </label>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Spamming, abusive behavior, etc."
              className="textarea textarea-bordered h-24 w-full"
            />
          </div>

          {/* Ban Duration */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Ban Duration (hours)</span>
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0 = permanent"
              min="0"
              className="input input-bordered w-full"
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Leave empty or 0 for permanent ban
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
              className="btn btn-error btn-block"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Banning...
                </>
              ) : (
                'Ban User'
              )}
            </button>
          </div>
        </form>

        <div className="text-xs text-center text-base-content/50 mt-6">
          ⚠️ This action is irreversible for the duration of the ban
        </div>
      </div>
    </div>
  );
}