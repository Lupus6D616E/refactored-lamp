import React from "react";

export const NoBusinessPage: React.FC = () => {
  const handleGoHome = () => {
    window.location.href = "verify.html";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl text-center">
        <div className="card-body">
          <h1 className="text-5xl font-bold text-error">403</h1>
          <h2 className="text-xl font-semibold mt-2">Business Not Found</h2>
          <p className="mt-2 text-base-content/70">
            Sorry, you do not have any verified Businesses.
          </p>

          <div className="card-actions justify-center mt-4">
            <button className="btn btn-primary" onClick={handleGoHome}>
              Go to Verification Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
