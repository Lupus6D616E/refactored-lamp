"use client";

import { authClient } from "@lib/auth-client";
import { edenTreatyApi } from "@lib/eden";
import { useEffect, useState } from "react";

export default function UserProfileCard() {
  const { data: session, isPending } = authClient.useSession();
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const getProfileDetails = async () => {
      
      if (!session?.user) return;

      const res = await edenTreatyApi.user.myprofile.get();
      if (res.data) {
        const userprofile = res.data;
        setDescription(userprofile.description ?? "");
        setAddress(userprofile.address ?? "");
        setEducation(userprofile.education ?? "");
        setSkills(userprofile.skills ?? []);
        setSchedule(userprofile.schedule ?? []);
      }
    };
    getProfileDetails();
  }, [session]); 

  const handleSendVerification = async () => {
    if (!session?.user?.email) return; 
    setLoading(true);
    setMessage(null);

    try {
      await authClient.sendVerificationEmail({
        email: session.user.email, 
      });
      setMessage("Verification email sent!");
    } catch (error) {
      console.error(error);
      setMessage("Failed to send verification email.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col items-center space-y-4">
            <div className="skeleton h-24 w-24 rounded-full" />
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-4 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return <p className="p-4 text-center"> You are not logged in! </p>;
  }

  const { user } = session;

  return (
    <div className="card w-96 bg-base-100 shadow-xl border border-base-200">
      <div className="card-body">
        <h2 className="card-title self-center">My Profile</h2>
        
        <div className="flex flex-col items-center text-center space-y-4">
          {!user.image ? (
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-24">
                <span className="text-3xl uppercase">
                  {user.name?.[0] ?? user.email[0]}
                </span>
              </div>
            </div>
          ) : (
            <div className="avatar">
              <div className="mask mask-squircle w-24">
                <img src={`/static/images/profilepicture/user/${user.id}`} alt="User profile" />
              </div>
            </div>
          )}

          <div className="w-full space-y-1">
            <p className="text-xl font-bold">{user.name}</p>
            <p className="text-sm opacity-60">{user.email}</p>
            <div className="badge badge-outline">{user.role}</div>
          </div>

          <div className="divider text-xs opacity-50 uppercase">Details</div>

          <div className="text-left w-full space-y-4">
            <div>
              <p className="font-bold text-sm">Description:</p>
              <p className="text-sm text-base-content/70 italic">{description || "No description yet."}</p>
            </div>

            <div>
              <p className="font-bold text-sm">Skills:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {skills.length > 0 ? (
                  skills.map((s, i) => <span key={i} className="badge badge-sm badge-ghost">{s}</span>)
                ) : (
                  <span className="text-xs opacity-50">None</span>
                )}
              </div>
            </div>

            <div>
              <p className="font-bold text-sm">Schedule:</p>
              <p className="text-sm text-base-content/70">{schedule.length > 0 ? schedule.join(", ") : "Not set"}</p>
            </div>
            
            <div className="border-t pt-4">
               <p className="font-bold text-sm">Email Status:</p>
               {user.emailVerified ? (
                 <p className="text-sm text-success font-medium">✓ Verified</p>
               ) : (
                 <div className="space-y-2 mt-2">
                   <p className="text-sm text-error font-medium">Unverified Account</p>
                   <button 
                     className={`btn btn-xs btn-primary w-full ${loading ? 'loading' : ''}`}
                     onClick={handleSendVerification} 
                     disabled={loading}
                   >
                     Verify Email
                   </button>
                 </div>
               )}
               {message && <p className="text-[10px] mt-1 text-center opacity-70">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}