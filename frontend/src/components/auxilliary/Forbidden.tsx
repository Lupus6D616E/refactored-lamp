export const ForbiddenPage = () => {

  const goBackHome = () => {
    window.location.href = '/public'; 
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        {/* Big 403 */}
        <div className="text-[12rem] font-black text-error leading-none mb-4">
          403
        </div>

        <h1 className="text-4xl font-bold text-base-content mb-2">
          Access Forbidden
        </h1>

        <p className="text-base-content/70 mb-8 text-lg">
          You don't have permission to access this page.
        </p>

        {/* Illustration / Icon */}
        <div className="mb-10 flex justify-center">
          <div className="text-8xl">🚫</div>
        </div>

        <button
          onClick={goBackHome}
          className="btn btn-primary btn-wide text-lg"
        >
          ← Back to Home
        </button>

        <p className="mt-6 text-sm text-base-content/50">
          If you believe this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
};
