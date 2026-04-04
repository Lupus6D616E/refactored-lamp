export const PendingPage = () => {

  const goBackHome = () => {
    window.location.href = '/public'; 
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        {/* Big 403 */}

        <h1 className="text-4xl font-bold text-base-content mb-2">
          Pending
        </h1>

        <p className="text-base-content/70 mb-8 text-lg">
          Your Business Application is Pending.
        </p>

        <button
          onClick={goBackHome}
          className="btn btn-primary btn-wide text-lg"
        >
          ← Back to Home
        </button>

        <p className="mt-6 text-sm text-base-content/50">
          If it has been over 10 days, please contact support.
        </p>
      </div>
    </div>
  );
};
