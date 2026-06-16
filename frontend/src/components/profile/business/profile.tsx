import { edenTreatyApi } from "@lib/eden";
import React, { useEffect, useState } from "react";


type Profile = {
  name: string;
  address: string | null;
  industry: string | null
  description: string | null;
  hasPicture: boolean
};

// Mock data shown before fetch completes
const mockProfile: Profile = {
  name: "Loading business",
  address: "Loading Street...",
  industry: "Loading industry...",
  description:
    "This is placeholder text while the real profile data is loading.",
  hasPicture: false
};

interface UserProfileProps {
  id: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ id }) => {
  const [profile, setProfile] = useState<Profile>(mockProfile);
  const [loading, setLoading] = useState<boolean>(true);



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await edenTreatyApi.business.profile({ id: id }).get();
        if (!res.data) throw new Error("Failed to fetch profile");
        const data: Profile = res.data;
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  return (
<div className="card w-full max-w-4xl bg-base-100 shadow-xl border border-primary/20 mx-auto">

  {/* Banner at Avatar Combo Area */}
  {profile.hasPicture && (
    <figure className="relative h-48 md:h-60 w-full bg-base-200 overflow-hidden">
      <img
        src={`/static/images/business/${id}/banner`}
        alt="Business Banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-transparent opacity-50" />
    </figure>
  )}

  <div className="card-body gap-6">
    
    {/* Profile Header & Avatar Placement */}
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
      {/* Dynamic Avatar Render base sa custom look mo */}
      {!profile.hasPicture ? (
        <div className="avatar placeholder shrink-0">
          <div className="bg-neutral text-neutral-content rounded-2xl w-20 h-20 shadow-md border-2 border-base-100">
            <span className="text-3xl font-black uppercase">
              {profile.name?.[0]}
            </span>
          </div>
        </div>
      ) : (
        <div className="avatar shrink-0">
          <div className="mask mask-squircle w-20 h-20 shadow-md border-2 border-base-100 bg-base-100">
            <img src={`/static/images/business/${id}/profilepicture`} alt={profile.name} />
          </div>
        </div>
      )}

      {/* Cool Title Placeholder Style */}
      <div className="space-y-1">
        <h2 className="text-3xl font-black italic tracking-tighter text-secondary uppercase flex flex-wrap items-center gap-2">
          {profile.name}
          <div className="badge badge-secondary animate-pulse text-xs italic font-bold">
            ACTIVE
          </div>
        </h2>
        <p className="text-xs font-bold tracking-widest text-base-content/50 uppercase">Verified Business Hub</p>
      </div>
    </div>

    {/* 5 Small Info Pieces (Quick Stats Layout) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-base-100 rounded-xl shadow-sm border border-base-200">
      
      {/* Industry */}
      <div className="bg-base-200 p-3 rounded-xl flex flex-col justify-between">
        <span className="text-[10px] uppercase font-bold tracking-wider text-primary opacity-80">Industry</span>
        <span className="text-sm font-bold text-base-content uppercase tracking-wide mt-1">{profile.industry}</span>
      </div>

      {/* Address */}
      <div className="bg-base-200 p-3 rounded-xl flex flex-col justify-between">
        <span className="text-[10px] uppercase font-bold tracking-wider text-primary opacity-80">Location Address</span>
        <span className="text-sm font-semibold text-base-content mt-1 line-clamp-1">{profile.address}</span>
      </div>

    </div>

    <div className="divider my-0"></div>

    {/* Long Text Sections Layout */}
    <div className="grid grid-cols-1 gap-6 my-2">
      
      {/* Details / Description Section */}
      <section className="bg-base-200/50 p-5 rounded-2xl border border-base-200 shadow-sm flex flex-col justify-between">
        <div className="prose prose-sm max-w-none">
          <h3 className="text-md font-bold uppercase tracking-wide flex items-center gap-2 text-primary mb-3">
            <span className="badge badge-primary badge-xs"></span>
            About the Business
          </h3>
          <p className="text-base-content/80 leading-relaxed text-sm whitespace-pre-wrap text-justify">
            {profile.description}
          </p>
        </div>
      </section>

    </div>

    {/* Smooth Loading Indicator Row */}
    {loading && (
      <div className="flex items-center justify-center gap-2 text-center opacity-70 text-xs font-bold uppercase tracking-wider py-2">
        <span className="loading loading-spinner loading-xs text-primary"></span>
        <span>Loading profile…</span>
      </div>
    )}

  </div>
</div>
  );
};

export default UserProfile;
