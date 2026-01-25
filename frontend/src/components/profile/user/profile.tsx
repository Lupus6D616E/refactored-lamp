import { edenTreatyApi } from "@lib/eden";
import React, { useEffect, useState } from "react";

type ExperienceItem = {
  id: number;
  experience: string;
  position: string;
};
type CertificateItem = {
  id: number;
  certification: string;
};

type Profile = {
  name: string;
  email: string;
  address: string | null;
  education: string| null
  role: string;
  description: string | null;
  certificateArray: CertificateItem[];
  experienceArray: ExperienceItem[];
  skills: string[] ;
  schedule: string[];
};

// Mock data shown before fetch completes
const mockProfile: Profile = {
  name: "Loading User",
  email: "loading@example.com",
  role: "Loading...",
  address: "Loading Street...",
  education: "Loading College...",
  description:
    "This is placeholder text while the real profile data is loading.",
  certificateArray: [
    { id: 0, certification: "Mock 1"},
    { id: 1, certification: "Mock 2"},
    { id: 2, certification: "Mock 3"},],
  experienceArray: [
    { id: 0, experience: "Mock 1", position: "Value 1" },
    { id: 1, experience: "Mock 2", position: "Value 2" },
  ],
  skills: ["mock", "loading"],
  schedule: ["Monday", "Tuesday", "Wednesday", "Thursday"],
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
        const res = await edenTreatyApi.user.userprofile({id: id}).get();
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
  const fetchResume = async() => {
     const { data, error } = await edenTreatyApi.user.downloaduserresume({id:id}).get(); 
      if (error) {
        console.error('Download failed:', error);
        return;
      }
      const blob = data instanceof Blob ? data : new Blob([data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="card-title text-2xl">{profile.name}</h2>
            <p className="text-sm opacity-70">{profile.email}</p>
            <div className="badge badge-primary mt-2">{profile.role}</div>
          </div>
          <button onClick={fetchResume} className="btn btn-outline btn-primary">Download resume</button>
        </div>
      </div>

      {/* Description Section */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="card-title">Description</h3>
          <p className="leading-relaxed">{profile.description}</p>
        </div>
      </div>

      {/* Array of Strings */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="card-title">Certificates</h3>
          <ul className="list-disc list-inside space-y-1">
            {profile.certificateArray.map((item, index) => (
              <li key={index}>{item.certification}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Array of Objects */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="card-title">Previous Work Experience</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Experience </th>
                  <th>Position </th>
                </tr>
              </thead>
              <tbody>
                {profile.experienceArray.map((obj, index) => (
                  <tr key={index}>
                    <td>{obj.experience}</td>
                    <td>{obj.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="card-title">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((tag, index) => (
              <span key={index} className="badge badge-secondary">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

        {/* Tags Section */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="card-title">Schedule</h3>
          <div className="flex flex-wrap gap-2">
            {profile.schedule.map((tag, index) => (
              <span key={index} className="badge badge-secondary">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center opacity-60 text-sm">Loading profile…</div>
      )}
    </div>
  );
};

export default UserProfile;
