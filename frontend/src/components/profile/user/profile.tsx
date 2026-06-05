"use client";

import { authClient } from "@lib/auth-client";
import { edenTreatyApi } from "@lib/eden";
import React, { useEffect, useState } from "react";

// --- Types ---
type Profile = {
  id: string;
  image: string | null;
  name: string;
  email: string;
  address: string | null;
  education: string | null;
  role: string;
  description: string | null;
  skills: string[];
  schedule: string[];
  certificateArray: any[];
  experienceArray: any[];
};

interface UserProfileProps {
  id: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ id }) => {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editData, setEditData] = useState({
    description: "",
    address: "",
    education: "",
    skills: "", 
  });

  const effectiveId = id || session?.user?.id;
  const isOwner = session?.user?.id === effectiveId;
  const fetchProfile = async (targetId: string) => {
    try {
      setLoading(true);
      
      const res = id 
        ? await edenTreatyApi.user.userprofile({ id: targetId }).get()
        : await edenTreatyApi.user.myprofile.get();
      
      if (res.data) {
        const userprofile = res.data as any;
        const profileImage = isOwner ? session?.user?.image : (userprofile.image || null);
        const profileName = isOwner ? session?.user?.name : (userprofile.name || userprofile.email?.split('@')[0] || "No Name");
        const profileEmail = isOwner ? session?.user?.email : (userprofile.email || "");
        const profileRole = isOwner ? session?.user?.role : (userprofile.role || "user");

        const fetchedProfile: Profile = {
          id: targetId,
          image: profileImage,
          name: profileName || "No Name",
          email: profileEmail || "",
          address: userprofile.address || "",
          education: userprofile.education || "",
          role: profileRole,
          description: userprofile.description || "",
          skills: Array.isArray(userprofile.skills) ? userprofile.skills : [],
          schedule: Array.isArray(userprofile.schedule) ? userprofile.schedule : [],
          certificateArray: userprofile.certificateArray || [],
          experienceArray: userprofile.experienceArray || [],
        };

        setProfile(fetchedProfile);
        setEditData({
          description: fetchedProfile.description || "",
          address: fetchedProfile.address || "",
          education: fetchedProfile.education || "",
          skills: fetchedProfile.skills.join(", "),
        });
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveId) {
      fetchProfile(effectiveId);
    }
  }, [effectiveId, session?.user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const res = await (edenTreatyApi.user.myprofile as any).post({
        description: editData.description,
        address: editData.address,
        education: editData.education,
        skills: editData.skills.split(",").map(s => s.trim()).filter(s => s !== ""),
      });
      if (!res.error) {
        setIsEditing(false);
        if (effectiveId) await fetchProfile(effectiveId); // Refresh data
      } else {
        alert("Failed to save: " + (res.error.value || "Unknown error"));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (sessionLoading || (loading && !profile)) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!effectiveId) {
    return (
      <div className="text-center p-20">
        <h2 className="text-xl font-bold text-error">Access Denied</h2>
        <p className="opacity-60">Please login first to view the profile.</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-20">
        <h2 className="text-xl font-bold text-error font-mono">Profile Not Found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body md:flex-row gap-8 items-center">
          <div className="avatar flex flex-col items-center gap-4">
            
            {profile.image === null ? (
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-24 h-24 flex items-center justify-center">
                  <span className="text-3xl uppercase">
                    {profile.name?.[0] ?? profile.email?.[0]}
                  </span>
                </div>
              </div>
            ) : (
              <div className="avatar">
                <div className="mask mask-squircle w-24">
                  <img src={`/static/images/profilepicture/user/${effectiveId}`} alt="Profile" />
                </div>
              </div>
            )}

          </div>

          <div className="flex-1 text-center md:text-left">
            {profile.name && <h2 className="text-3xl font-bold">{profile.name}</h2>}
            <p className="opacity-60">{profile.email}</p>
            <div className="badge badge-primary mt-2">{profile.role}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side Column */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-md p-6">
            <h3 className="font-bold border-b mb-4 pb-1 text-xs uppercase opacity-50 tracking-widest">General Information</h3>
            {isEditing ? (
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label-text font-bold text-xs">ADDRESS</label>
                  <input className="input input-bordered input-sm" value={editData.address} onChange={(e)=>setEditData({...editData, address: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label-text font-bold text-xs">EDUCATION</label>
                  <input className="input input-bordered input-sm" value={editData.education} onChange={(e)=>setEditData({...editData, education: e.target.value})} />
                </div>
                <button className="btn btn-primary btn-sm w-full mt-2" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold opacity-60">ADDRESS</p>
                  <p className="text-sm">{profile.address || "No address set"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold opacity-60">EDUCATION</p>
                  <p className="text-sm">{profile.education || "No education set"}</p>
                </div>
                <div>
                  <p className="text-xs font-bold opacity-60">SCHEDULE AVAILABILITY</p>
                  <p className="text-sm">{profile.schedule.join(", ") || "No schedule set"}</p>
                </div>
              </div>
            )}
          </div>
        </div>


        <div className="md:col-span-2 space-y-6">
  <div className="card bg-base-100 shadow-md p-8">
    <h3 className="font-bold border-b mb-3 pb-1 text-xs uppercase opacity-50 tracking-widest">Description</h3>
    {isEditing ? (
      <textarea 
        className="textarea textarea-bordered h-32 w-full text-sm break-all whitespace-pre-wrap overflow-y-auto" 
        value={editData.description} 
        onChange={(e)=>setEditData({...editData, description: e.target.value})} 
      />
    ) : (
    
      <p className="text-sm leading-relaxed text-justify opacity-80 break-all whitespace-pre-wrap">
        {profile.description || "No description provided."}
      </p>
    )}
  </div>

  
  <div className="card bg-base-100 shadow-md p-8">
    <h3 className="font-bold border-b mb-3 pb-1 text-xs uppercase opacity-50 tracking-widest">Skills</h3>
    {isEditing ? (
     
      <textarea 
        className="textarea textarea-bordered w-full text-sm break-all min-h-[3rem] py-2" 
        value={editData.skills} 
        onChange={(e)=>setEditData({...editData, skills: e.target.value})} 
        placeholder="e.g. React, Node.js, SQL"
        rows={2}
      />
    ) : (
      <div className="flex flex-wrap gap-2">
        {profile.skills.length > 0 ? (
          profile.skills.map((s, i) => (
           
            <span key={i} className="badge badge-outline badge-secondary h-auto py-1 break-all text-center">
              {s}
            </span>
          ))
        ) : (
          <p className="text-xs opacity-50 italic">No skills listed</p>
        )}
      </div>
    )}
  </div> 
</div>
      </div>
    </div>
  );
};