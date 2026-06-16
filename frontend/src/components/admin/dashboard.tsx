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
          <span className="text-xl font-bold">FlexiHire Admin Dashboard</span>
        </div>
        <div className="flex-none">
          {loading && <span className="loading loading-spinner loading-sm" />}
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
          <SearchUserCard />
          <SearchComponent />
          <AddBusinessCard />
          <SearchBusinessCard />
          <AddUserCard />
          <BanUserCard />
          <UnbanUserCard /> 
        </div>
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
