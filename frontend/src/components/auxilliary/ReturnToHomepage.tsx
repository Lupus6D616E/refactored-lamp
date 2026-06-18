import React from 'react';

export const NotLoggedIn: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          {/* Icon */}
          <div className="w-24 h-24 rounded-full bg-base-300 flex items-center justify-center mb-6">
            <span className="text-5xl">🔒</span>
          </div>

          <h2 className="card-title text-2xl mb-2">You are not logged in</h2>
          
          <p className="text-base-content/70 mb-8">
            Please log in to access this page
          </p>

          <a
            href="index.html"
            className="btn btn-primary btn-wide"
          >
            Return to Homepage
          </a>

          <p className="text-xs text-base-content/50 mt-6">
            Redirecting you back to the main page
          </p>
        </div>
      </div>
    </div>
  );
};