import { edenTreatyApi } from "@lib/eden";
import React, { useEffect, useState } from "react";


type Profile = {
  name: string;
  address: string | null;
  industry: string| null
  description: string | null;
 
};

// Mock data shown before fetch completes
const mockProfile: Profile = {
  name: "Loading business",
  address: "Loading Street...",
  industry: "Loading industry...",
  description:
    "This is placeholder text while the real profile data is loading.",

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
        const res = await edenTreatyApi.business.profile({id: id}).get();
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
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="card-title text-2xl">{profile.name}</h2>
            <p className="leading-relaxed">address: {profile.address}</p>
            <p className="leading-relaxed">industry: {profile.industry}</p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="card-title">Description</h3>
          <p className="leading-relaxed">{profile.description}</p>
        </div>
      </div>

      {loading && (
        <div className="text-center opacity-60 text-sm">Loading profile…</div>
      )}
    </div>
  );
};

export default UserProfile;
