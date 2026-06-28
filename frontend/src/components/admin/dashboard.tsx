// components/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { SearchUserCard } from "./searchuser";
import { SearchComponent } from "@components/search/search";
import { edenTreatyApi } from "@lib/eden";
import { AddBusinessCard } from "./addbusiness";
import { SearchBusinessCard } from "./searchbusiness";
import { AddUserCard } from "./addusertobusiness";
import BanUserCard from "./BanUserCard";
import UnbanUserCard from "./UnbanUserCard";
import LogoutButton from "@components/auth/logout";
import AccessibilityWidget from '@components/auxilliary/accessability'

export interface AdminStats {
  seekers: number;
  businesses: number;
  userTotal: number;
  jobPosts: number;
  applicationTotal: number;
  applicationPending: number;
  applicationAccepted: number;
  applicationRejected: number;
  uptime: string;
}

export const mockAdminData: AdminStats = {
  seekers: 1280,
  businesses: 342,
  userTotal: 21331,
  jobPosts: 45230,
  applicationTotal: 1,
  applicationPending: 2,
  applicationAccepted: 3,
  applicationRejected: 4,
  uptime: "99.9%",
};

export function AdminDashboard() {
  const [data, setData] = useState<AdminStats>(mockAdminData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await edenTreatyApi.admin.stats.get();

        if (!res.data) {
          throw new Error("Failed to fetch admin data");
        }

        const realData: AdminStats = res.data;
        setData(realData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow">
        <div className="flex-1">
          <a href="/public/dashboard.html" className="text-3xl font-black font-brand tracking-tighter bg-gradient-to-r from-[#0038a8] to-[#00ced1] bg-clip-text text-transparent cursor-pointer">
            FlexiHire</a>
            <a href="/public/dashboard.html" className="ml-2 font-normal-case text-xl ml-4">
             Admin Dashboard
          </a>
        </div>

<div className="flex items-center gap-3">
  {/* 1. Create Post Button */}
  <a 
    href="/public/admincreatepost.html" 
    className="btn btn-sm btn-ghost gap-2 normal-case flex items-center"
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth="2.5" 
      stroke="currentColor" 
      className="w-4 h-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
    <span>Create Post</span>
  </a>
  
  {/* 2. Inbox Button */}
  <button 
    className="btn btn-sm btn-primary gap-2 shadow-sm hover:shadow-md transition-all duration-200 normal-case flex items-center"
    onClick={() => window.location.href = '/public/adminemail.html'}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={2} 
      stroke="currentColor" 
      className="w-4 h-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
    <span>Inbox</span>
  </button>

  {/* 3. Loading Spinner Container */}
  {loading && (
    <div className="flex items-center justify-center min-w-[24px]">
      <span className="loading loading-spinner loading-sm" />
    </div>
  )}
  
  {/* 4. Logout Button */}
  <div className="flex items-center">
    <LogoutButton />
  </div>
</div>
      </div>

    
      {/* Content */}
      <main className="p-6">
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          <StatCard title="Seekers" value={data.seekers} />
          <StatCard title="Businesses" value={data.businesses} />
          <StatCard title="Total Users" value={data.userTotal} />
          <StatCard title="Total Applications" value={data.applicationTotal} />
          <StatCard
            title="Pending Applications"
            value={data.applicationPending}
          />
          <StatCard
            title="Accepted Applications"
            value={data.applicationAccepted}
          />
          <StatCard
            title="Rejected Applications"
            value={data.applicationRejected}
          />
          <StatCard title="Uptime" value={data.uptime} />
        </div>

        <SearchComponent /> 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6 ">
          <SearchUserCard />
          <SearchBusinessCard />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
           <AddBusinessCard />
           <AddUserCard />
        </div>

         <div className="flex flex-col md:flex-row gap-6 p-6 justify-center items-center w-full">
  <BanUserCard />
  <UnbanUserCard />
</div>
          
      <AccessibilityWidget/>
      </main>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title text-sm opacity-70">{title}</h2>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
}
