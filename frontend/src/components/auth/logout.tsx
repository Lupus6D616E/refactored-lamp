'use client';

import { authClient } from '@lib/auth-client';

export default function LogoutButton() {

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/public/dashboard.html"
  };

  return (
    <button className="btn btn-outline btn-error" onClick={handleLogout}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      Log out
    </button>
  );
}