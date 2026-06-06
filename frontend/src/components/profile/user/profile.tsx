"use client";

import { authClient } from "@lib/auth-client";
import { edenTreatyApi } from "@lib/eden";
import React, { useEffect, useState } from "react";
import CertificationList from '@components/dashboard/user/info/certificationlist-parent';
import { ApplyTheme } from "@components/auxilliary/ApplyTheme";
import ExperienceList from '@components/dashboard/user/info/experiencelist-parent';

type ExperienceItem = {
  id: number;
  experience: string;
  position: string;
  duration: string;
};

type CertificateItem = {
  id: number;
  certification: string;
};

interface BusinessInfo {
  id: string;
  name: string | null;
}

type Profile = {
  id: string;
  image: string | null;
  name: string;
  email: string;
  address: string | null;
  education: string | null;
  role: string;
  description: string | null;
  certificateArray: CertificateItem[];
  experienceArray: ExperienceItem[];
  skills: string[];
  schedule: string[];
};

interface UserProfileProps {
  id: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ id }) => {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [businesses, setBusinesses] = useState<BusinessInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);

  const effectiveId = id || session?.user?.id;
  const isOwner = session?.user?.id === effectiveId;

  const fetchProfile = async (targetId: string) => {
    try {
      setLoading(true);
      
      const res = await edenTreatyApi.user.userprofile({ id: targetId }).get()

      if (res.data) {
        const userprofile = res.data as any;
        
        // ⚠️ FIXED LINE: Kukunin na natin ang db string indicator imbis na pilitin ang session image
        const profileImage = userprofile.image || session?.user?.image || null;
        
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
          certificateArray: userprofile.certificateArray,
          experienceArray: userprofile.experienceArray,
        };

        setProfile(fetchedProfile);
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

  const fetchBusinesses = async () => {
    try {
      const res = await edenTreatyApi.business.mybusinesses.get();
      if (res.data) {
        setBusinesses(res.data);
        setSelectedId(res.data[0]?.id);
      }
    } catch (err) {
      console.error("Fetch businesses error:", err);
    } finally {
      setLoadingBusinesses(false);
    }
  };

  useEffect(() => {
    if (effectiveId) {
      fetchProfile(effectiveId);
    }
    
    if (session?.user?.role !== "user" && session !== null) {
      fetchBusinesses();
    }
  }, [effectiveId, session?.user]);

  function goDownloadResume() {
    window.location.href = `/user/downloaduserresume/${effectiveId}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!effectiveId) {
      setError("User ID is missing.");
      setLoading(false);
      return;
    }
    try {
      const res = await edenTreatyApi.message.user({ id: effectiveId }).post({ 
        message: message, 
        subject: subject, 
        businessId: selectedId! 
      });
      if (!res.error) {
        setMessage("");
        setSubject("");
        alert("Message sent successfully!");
      } else {
        setError("Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  }

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
      <ApplyTheme />
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex flex-col md:flex-row gap-6 items-center flex-1 text-center md:text-left">
            
            {/* LIGTAS NA AVATAR CONDITIONAL RENDERING SA PROFILE */}
            {!profile.image ? (
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-24 h-24 flex items-center justify-center">
                  <span className="text-3xl uppercase">
                    {profile.name?.[0] ?? profile.email?.[0]}
                  </span>
                </div>
              </div>
            ) : (
              <div className="avatar">
                <div className="mask mask-squircle w-24 h-24">
                  <img 
                    src={`/static/images/profilepicture/user/${effectiveId}`} 
                    alt="Profile" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name ?? 'User')}`;
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <h2 className="text-3xl font-bold">{profile.name}</h2>
              <p className="opacity-60">{profile.email}</p>
              <div className="badge badge-primary mt-2">{profile.role}</div>
            </div>
          </div>
          <button onClick={goDownloadResume} className="btn btn-outline btn-primary self-center md:self-auto">
            Download resume
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-md p-6 border border-base-200">
            <h3 className="font-bold border-b mb-4 pb-1 text-xs uppercase opacity-50 tracking-widest">General Information</h3>
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
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.schedule.length > 0 ? (
                    profile.schedule.map((tag, index) => (
                      <span key={index} className="badge badge-sm badge-secondary">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm opacity-50 italic">No schedule set</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="card bg-base-100 shadow-md p-8 border border-base-200">
            <h3 className="font-bold border-b mb-3 pb-1 text-xs uppercase opacity-50 tracking-widest">Description</h3>
            <p className="text-sm leading-relaxed text-justify opacity-80 break-all whitespace-pre-wrap">
              {profile.description || "No description provided."}
            </p>
          </div>

          <div className="card bg-base-100 shadow-md p-8 border border-base-200">
            <h3 className="font-bold border-b mb-3 pb-1 text-xs uppercase opacity-50 tracking-widest">Skills</h3>
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
          </div>
           <div className="grid gap-4">
        {profile.certificateArray.map((item) => (
          <div 
            key={item.id}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all border border-base-300"
          >
            <div className="card-body flex-row items-center gap-4">
     
              
              <div>
                <h3 className="card-title text-lg">{item.certification}</h3>
              </div>

            </div>
          </div>
        ))}
      </div>

          <div className="grid gap-4">
        {profile.experienceArray.map((item) => (
          <div 
            key={item.id}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all border border-base-300"
          >
            <div className="card-body flex-row items-center gap-4">
     
              
              <div>
                <h3 className="card-title text-lg">{item.experience}</h3>
                <h4> {item.position}</h4>
                <p className="text-base-content/70">{item.duration}</p>
              </div>

            </div>
          </div>
        ))}
      </div>

          {session?.user?.role !== "user" && session !== null && (
            <div className="card bg-base-100 shadow-md p-8 border border-base-200">
              <form onSubmit={handleSubmit} className="space-y-4 max-w-full">
                <h3 className="font-bold border-b mb-3 pb-1 text-xs uppercase opacity-50 tracking-widest">Message this User</h3>
                
                {session?.user?.role === "business" && (
                  <div className="form-control w-full max-w-xs">
                    <label className="label"><span className="label-text font-semibold text-xs">SELECT BUSINESS</span></label>
                    <select
                      className="select select-bordered select-sm"
                      value={selectedId}
                      onChange={(e) => setSelectedId(e.target.value)}
                      disabled={loadingBusinesses}
                    >
                      {businesses.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="form-control">
                  <input
                    type="text"
                    placeholder="Subject"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="input input-bordered input-sm w-full"
                  />
                </div>

                <div className="form-control">
                  <textarea
                    placeholder="Your message here..."
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="textarea textarea-bordered h-24 w-full text-sm"
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-neutral btn-sm w-full md:w-auto"
                >
                  {loading ? "Sending message..." : "Send Message"}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};