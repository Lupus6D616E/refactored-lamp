'use client';

import { authClient } from 'backend/src/lib/auth-client'; 

export default function UserProfileCard() {
    
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <div className="skeleton h-16 w-16 shrink-0 rounded-full" />
            <div className="space-y-2">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-4 w-48" />
              <div className="skeleton h-4 w-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return <p> You are not logged in! </p>
  }

  const { user } = session;

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Welcome back!</h2>
        <div className="flex items-center space-x-4">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-16">
              <span className="text-xl uppercase">
                {user.name?.[0] ?? user.email[0]}
              </span>
            </div>
          </div>
          <div>
            {user.name && <p className="text-lg font-semibold">{user.name}</p>}
            <p className="text-sm text-base-content/70">{user.email}</p>
            <p className="text-sm text-base-content/70">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}